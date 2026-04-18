"use client";

import { Zap, GitBranch, ExternalLink } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--card)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[var(--foreground)]">
              TON Access
            </h1>
            <p className="text-xs text-[var(--muted-foreground)]">
              RPC Endpoint Tester
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://toncenter.com/api/v2/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
          >
            API Docs
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <a
            href="https://github.com/orbs-network/ton-access"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--secondary)] transition-colors hover:bg-[var(--muted)]"
          >
            <GitBranch className="h-4 w-4 text-[var(--foreground)]" />
          </a>
        </div>
      </div>
    </header>
  );
}
