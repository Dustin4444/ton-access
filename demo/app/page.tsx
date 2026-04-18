"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { NetworkSelector } from "@/components/network-selector";
import { EndpointCard } from "@/components/endpoint-card";
import { RPCTester } from "@/components/rpc-tester";
import { NodesStatus } from "@/components/nodes-status";

export default function Home() {
  const [network, setNetwork] = useState<"mainnet" | "testnet">("mainnet");
  const [apiVersion, setApiVersion] = useState<"v2" | "v4">("v2");

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Network Selector */}
        <div className="mb-8">
          <NetworkSelector
            network={network}
            setNetwork={setNetwork}
            apiVersion={apiVersion}
            setApiVersion={setApiVersion}
          />
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <EndpointCard
            title="API Version"
            value={apiVersion === "v2" ? "TonCenter v2" : "TonHub v4"}
            description="Active protocol"
            variant="primary"
          />
          <EndpointCard
            title="Network"
            value={network.charAt(0).toUpperCase() + network.slice(1)}
            description="TON Network"
            variant="default"
          />
          <EndpointCard
            title="Access Type"
            value="Decentralized"
            description="Via Orbs Network"
            variant="accent"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* RPC Tester */}
          <div className="lg:col-span-2">
            <RPCTester network={network} apiVersion={apiVersion} />
          </div>

          {/* Nodes Status */}
          <div className="lg:col-span-2">
            <NodesStatus />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-6 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-[var(--muted-foreground)]">
            Powered by{" "}
            <a
              href="https://github.com/orbs-network/ton-access"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--primary)] hover:underline"
            >
              @orbs-network/ton-access
            </a>{" "}
            — Unthrottled anonymous RPC access to TON blockchain
          </p>
        </div>
      </footer>
    </div>
  );
}
