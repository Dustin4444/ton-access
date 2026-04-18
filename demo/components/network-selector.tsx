"use client";

interface NetworkSelectorProps {
  network: "mainnet" | "testnet";
  setNetwork: (network: "mainnet" | "testnet") => void;
  apiVersion: "v2" | "v4";
  setApiVersion: (version: "v2" | "v4") => void;
}

export function NetworkSelector({
  network,
  setNetwork,
  apiVersion,
  setApiVersion,
}: NetworkSelectorProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">
          Configuration
        </h2>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Select your network and API version
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Network Toggle */}
        <div className="flex rounded-lg border border-[var(--border)] bg-[var(--card)] p-1">
          <button
            onClick={() => setNetwork("mainnet")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
              network === "mainnet"
                ? "bg-[var(--primary)] text-white"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            Mainnet
          </button>
          <button
            onClick={() => setNetwork("testnet")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
              network === "testnet"
                ? "bg-[var(--primary)] text-white"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            Testnet
          </button>
        </div>

        {/* API Version Toggle */}
        <div className="flex rounded-lg border border-[var(--border)] bg-[var(--card)] p-1">
          <button
            onClick={() => setApiVersion("v2")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
              apiVersion === "v2"
                ? "bg-[var(--accent)] text-white"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            TonCenter v2
          </button>
          <button
            onClick={() => setApiVersion("v4")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
              apiVersion === "v4"
                ? "bg-[var(--accent)] text-white"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            TonHub v4
          </button>
        </div>
      </div>
    </div>
  );
}
