"use client";

import { useState, useCallback } from "react";
import {
  Play,
  Copy,
  Check,
  Loader2,
  ChevronDown,
  Wallet,
  Blocks,
  Info,
} from "lucide-react";
import { JsonViewer } from "./json-viewer";

interface RPCTesterProps {
  network: "mainnet" | "testnet";
  apiVersion: "v2" | "v4";
}

type Method = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  defaultParams?: Record<string, string>;
};

const V2_METHODS: Method[] = [
  {
    id: "getAddressBalance",
    name: "Get Address Balance",
    description: "Get balance of an address",
    icon: <Wallet className="h-4 w-4" />,
    defaultParams: {
      address: "EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N",
    },
  },
  {
    id: "getAddressInformation",
    name: "Get Address Info",
    description: "Get full address information",
    icon: <Info className="h-4 w-4" />,
    defaultParams: {
      address: "EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N",
    },
  },
  {
    id: "getMasterchainInfo",
    name: "Get Masterchain Info",
    description: "Get latest masterchain block",
    icon: <Blocks className="h-4 w-4" />,
  },
];

const V4_METHODS: Method[] = [
  {
    id: "block/latest",
    name: "Get Latest Block",
    description: "Get the latest block info",
    icon: <Blocks className="h-4 w-4" />,
  },
  {
    id: "account",
    name: "Get Account",
    description: "Get account state",
    icon: <Wallet className="h-4 w-4" />,
    defaultParams: {
      address: "EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N",
    },
  },
];

export function RPCTester({ network, apiVersion }: RPCTesterProps) {
  const methods = apiVersion === "v2" ? V2_METHODS : V4_METHODS;
  const [selectedMethod, setSelectedMethod] = useState<Method>(methods[0]);
  const [address, setAddress] = useState(
    "EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [endpoint, setEndpoint] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const executeRequest = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);
    setResponseTime(null);

    const startTime = performance.now();

    try {
      // First, get the endpoint from the Orbs network
      const nodesResponse = await fetch(
        "https://ton.access.orbs.network/mngr/nodes"
      );
      const nodes = await nodesResponse.json();

      // Find a healthy node for the current protocol-network combo
      const protoNet = `${apiVersion === "v2" ? "v2" : "v4"}-${network}`;
      const healthyNodes = nodes.filter(
        (node: { Weight: number; Mngr?: { health?: Record<string, boolean> } }) =>
          node.Weight > 0 && node.Mngr?.health?.[protoNet]
      );

      if (healthyNodes.length === 0) {
        throw new Error("No healthy nodes available");
      }

      // Pick a random node weighted by Weight
      const totalWeight = healthyNodes.reduce(
        (sum: number, n: { Weight: number }) => sum + n.Weight,
        0
      );
      let random = Math.random() * totalWeight;
      let selectedNode = healthyNodes[0];
      for (const node of healthyNodes) {
        random -= node.Weight;
        if (random <= 0) {
          selectedNode = node;
          break;
        }
      }

      const protocol =
        apiVersion === "v2" ? "toncenter-api-v2" : "ton-api-v4";
      const baseUrl = `https://ton.access.orbs.network/${selectedNode.NodeId}/1/${network}/${protocol}`;
      setEndpoint(baseUrl);

      let url: string;
      if (apiVersion === "v2") {
        // TonCenter API v2
        if (selectedMethod.id === "getMasterchainInfo") {
          url = `${baseUrl}/getMasterchainInfo`;
        } else if (selectedMethod.id === "getAddressBalance") {
          url = `${baseUrl}/getAddressBalance?address=${address}`;
        } else if (selectedMethod.id === "getAddressInformation") {
          url = `${baseUrl}/getAddressInformation?address=${address}`;
        } else {
          url = baseUrl;
        }
      } else {
        // TonHub API v4
        if (selectedMethod.id === "block/latest") {
          url = `${baseUrl}/block/latest`;
        } else if (selectedMethod.id === "account") {
          // For v4, we need to get the latest seqno first
          const latestRes = await fetch(`${baseUrl}/block/latest`);
          const latestData = await latestRes.json();
          const seqno = latestData.last?.seqno;
          url = `${baseUrl}/account/${seqno}/${address}`;
        } else {
          url = baseUrl;
        }
      }

      const res = await fetch(url);
      const data = await res.json();
      setResponse(data);
      setResponseTime(performance.now() - startTime);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setResponseTime(performance.now() - startTime);
    } finally {
      setIsLoading(false);
    }
  }, [apiVersion, network, selectedMethod, address]);

  const copyEndpoint = useCallback(() => {
    if (endpoint) {
      navigator.clipboard.writeText(endpoint);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [endpoint]);

  // Update selected method when API version changes
  const currentMethods = apiVersion === "v2" ? V2_METHODS : V4_METHODS;
  if (!currentMethods.find((m) => m.id === selectedMethod.id)) {
    setSelectedMethod(currentMethods[0]);
  }

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)]">
      <div className="border-b border-[var(--border)] p-4">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">
          RPC Endpoint Tester
        </h3>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Test live RPC calls to the TON blockchain
        </p>
      </div>

      <div className="p-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Method Selector */}
          <div className="relative flex-1">
            <label className="mb-1.5 block text-sm font-medium text-[var(--muted-foreground)]">
              Method
            </label>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex w-full items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-3 text-left transition-colors hover:border-[var(--muted-foreground)]"
            >
              <div className="flex items-center gap-3">
                <span className="text-[var(--primary)]">
                  {selectedMethod.icon}
                </span>
                <div>
                  <span className="block text-sm font-medium text-[var(--foreground)]">
                    {selectedMethod.name}
                  </span>
                  <span className="block text-xs text-[var(--muted-foreground)]">
                    {selectedMethod.description}
                  </span>
                </div>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-[var(--muted-foreground)] transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-xl">
                {currentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => {
                      setSelectedMethod(method);
                      setDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--secondary)] ${
                      selectedMethod.id === method.id
                        ? "bg-[var(--secondary)]"
                        : ""
                    }`}
                  >
                    <span className="text-[var(--primary)]">{method.icon}</span>
                    <div>
                      <span className="block text-sm font-medium text-[var(--foreground)]">
                        {method.name}
                      </span>
                      <span className="block text-xs text-[var(--muted-foreground)]">
                        {method.description}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Address Input */}
          {selectedMethod.defaultParams?.address && (
            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-medium text-[var(--muted-foreground)]">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter TON address"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-3 font-mono text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              />
            </div>
          )}

          {/* Execute Button */}
          <div className="flex items-end">
            <button
              onClick={executeRequest}
              disabled={isLoading}
              className="flex h-[50px] items-center gap-2 rounded-lg bg-[var(--primary)] px-6 font-medium text-white transition-colors hover:bg-[var(--primary)]/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Execute
            </button>
          </div>
        </div>

        {/* Endpoint Display */}
        {endpoint && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] p-3">
            <span className="text-xs text-[var(--muted-foreground)]">
              Endpoint:
            </span>
            <code className="flex-1 truncate font-mono text-xs text-[var(--foreground)]">
              {endpoint}
            </code>
            <button
              onClick={copyEndpoint}
              className="rounded p-1 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
            >
              {copied ? (
                <Check className="h-4 w-4 text-[var(--success)]" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        )}

        {/* Response */}
        {(response || error) && (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--foreground)]">
                Response
              </span>
              {responseTime && (
                <span className="text-xs text-[var(--muted-foreground)]">
                  {responseTime.toFixed(0)}ms
                </span>
              )}
            </div>
            <div className="max-h-96 overflow-auto rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
              {error ? (
                <div className="flex items-center gap-2 text-[var(--destructive)]">
                  <span className="text-sm">{error}</span>
                </div>
              ) : (
                <JsonViewer data={response} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
