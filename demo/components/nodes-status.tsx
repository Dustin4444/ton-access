"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw, Server, CheckCircle, XCircle, Clock } from "lucide-react";

interface Node {
  NodeId: string;
  BackendName: string;
  Ip: string;
  Weight: number;
  Healthy: string;
  Mngr: {
    updated: string;
    health: {
      "v2-mainnet": boolean;
      "v2-testnet": boolean;
      "v4-mainnet": boolean;
      "v4-testnet": boolean;
    };
    successTS: number;
    errors: string[];
    code: number;
    text: string;
  };
}

export function NodesStatus() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchNodes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://ton.access.orbs.network/mngr/nodes"
      );
      const data = await response.json();
      setNodes(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch nodes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNodes();
  }, [fetchNodes]);

  const healthyCount = nodes.filter((n) => n.Healthy === "1").length;
  const totalWeight = nodes.reduce((sum, n) => sum + n.Weight, 0);

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] p-4">
        <div>
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            Network Nodes
          </h3>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Orbs Network decentralized RPC infrastructure
          </p>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
              <Clock className="h-3.5 w-3.5" />
              {lastUpdated.toLocaleTimeString()}
            </div>
          )}
          <button
            onClick={fetchNodes}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--secondary)] transition-colors hover:bg-[var(--muted)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 text-[var(--foreground)] ${
                loading ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 border-b border-[var(--border)] p-4 sm:grid-cols-4">
        <div>
          <span className="block text-xs text-[var(--muted-foreground)]">
            Total Nodes
          </span>
          <span className="text-xl font-semibold text-[var(--foreground)]">
            {nodes.length}
          </span>
        </div>
        <div>
          <span className="block text-xs text-[var(--muted-foreground)]">
            Healthy
          </span>
          <span className="text-xl font-semibold text-[var(--success)]">
            {healthyCount}
          </span>
        </div>
        <div>
          <span className="block text-xs text-[var(--muted-foreground)]">
            Unhealthy
          </span>
          <span className="text-xl font-semibold text-[var(--destructive)]">
            {nodes.length - healthyCount}
          </span>
        </div>
        <div>
          <span className="block text-xs text-[var(--muted-foreground)]">
            Total Weight
          </span>
          <span className="text-xl font-semibold text-[var(--foreground)]">
            {totalWeight}
          </span>
        </div>
      </div>

      {/* Nodes Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-xs text-[var(--muted-foreground)]">
              <th className="px-4 py-3 font-medium">Node</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">
                Weight
              </th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">
                v2-mainnet
              </th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">
                v2-testnet
              </th>
              <th className="hidden px-4 py-3 font-medium lg:table-cell">
                v4-mainnet
              </th>
              <th className="hidden px-4 py-3 font-medium lg:table-cell">
                v4-testnet
              </th>
            </tr>
          </thead>
          <tbody>
            {nodes.map((node) => (
              <tr
                key={node.NodeId}
                className="border-b border-[var(--border)] last:border-0"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-[var(--muted-foreground)]" />
                    <div>
                      <span className="block text-sm font-medium text-[var(--foreground)]">
                        {node.BackendName}
                      </span>
                      <span className="block font-mono text-xs text-[var(--muted-foreground)]">
                        {node.NodeId.slice(0, 8)}...
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {node.Healthy === "1" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--success)]/10 px-2 py-1 text-xs font-medium text-[var(--success)]">
                      <CheckCircle className="h-3 w-3" />
                      Healthy
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--destructive)]/10 px-2 py-1 text-xs font-medium text-[var(--destructive)]">
                      <XCircle className="h-3 w-3" />
                      Unhealthy
                    </span>
                  )}
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  <span className="text-sm text-[var(--foreground)]">
                    {node.Weight}
                  </span>
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  <HealthIndicator healthy={node.Mngr?.health?.["v2-mainnet"]} />
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  <HealthIndicator healthy={node.Mngr?.health?.["v2-testnet"]} />
                </td>
                <td className="hidden px-4 py-3 lg:table-cell">
                  <HealthIndicator healthy={node.Mngr?.health?.["v4-mainnet"]} />
                </td>
                <td className="hidden px-4 py-3 lg:table-cell">
                  <HealthIndicator healthy={node.Mngr?.health?.["v4-testnet"]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function HealthIndicator({ healthy }: { healthy?: boolean }) {
  if (healthy === undefined) {
    return <span className="text-[var(--muted-foreground)]">-</span>;
  }

  return healthy ? (
    <CheckCircle className="h-4 w-4 text-[var(--success)]" />
  ) : (
    <XCircle className="h-4 w-4 text-[var(--destructive)]" />
  );
}
