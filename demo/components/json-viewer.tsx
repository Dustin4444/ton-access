"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

interface JsonViewerProps {
  data: unknown;
  level?: number;
}

export function JsonViewer({ data, level = 0 }: JsonViewerProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleCollapse = (key: string) => {
    setCollapsed((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderValue = (value: unknown, key: string, path: string): React.ReactNode => {
    if (value === null) {
      return <span className="json-null">null</span>;
    }

    if (typeof value === "boolean") {
      return <span className="json-boolean">{value.toString()}</span>;
    }

    if (typeof value === "number") {
      return <span className="json-number">{value}</span>;
    }

    if (typeof value === "string") {
      return <span className="json-string">&quot;{value}&quot;</span>;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span className="text-[var(--muted-foreground)]">[]</span>;
      }

      const isCollapsed = collapsed[path];

      return (
        <span>
          <button
            onClick={() => toggleCollapse(path)}
            className="inline-flex items-center text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            {isCollapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </button>
          <span className="text-[var(--muted-foreground)]">[</span>
          {isCollapsed ? (
            <span className="text-[var(--muted-foreground)]">
              {" "}
              ...{value.length} items{" "}
            </span>
          ) : (
            <>
              {value.map((item, index) => (
                <div key={index} style={{ marginLeft: `${(level + 1) * 16}px` }}>
                  {renderValue(item, String(index), `${path}.${index}`)}
                  {index < value.length - 1 && (
                    <span className="text-[var(--muted-foreground)]">,</span>
                  )}
                </div>
              ))}
            </>
          )}
          {!isCollapsed && (
            <div style={{ marginLeft: `${level * 16}px` }}>
              <span className="text-[var(--muted-foreground)]">]</span>
            </div>
          )}
          {isCollapsed && (
            <span className="text-[var(--muted-foreground)]">]</span>
          )}
        </span>
      );
    }

    if (typeof value === "object") {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) {
        return <span className="text-[var(--muted-foreground)]">{"{}"}</span>;
      }

      const isCollapsed = collapsed[path];

      return (
        <span>
          <button
            onClick={() => toggleCollapse(path)}
            className="inline-flex items-center text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            {isCollapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </button>
          <span className="text-[var(--muted-foreground)]">{"{"}</span>
          {isCollapsed ? (
            <span className="text-[var(--muted-foreground)]">
              {" "}
              ...{entries.length} keys{" "}
            </span>
          ) : (
            <>
              {entries.map(([k, v], index) => (
                <div key={k} style={{ marginLeft: `${(level + 1) * 16}px` }}>
                  <span className="json-key">&quot;{k}&quot;</span>
                  <span className="text-[var(--muted-foreground)]">: </span>
                  {renderValue(v, k, `${path}.${k}`)}
                  {index < entries.length - 1 && (
                    <span className="text-[var(--muted-foreground)]">,</span>
                  )}
                </div>
              ))}
            </>
          )}
          {!isCollapsed && (
            <div style={{ marginLeft: `${level * 16}px` }}>
              <span className="text-[var(--muted-foreground)]">{"}"}</span>
            </div>
          )}
          {isCollapsed && (
            <span className="text-[var(--muted-foreground)]">{"}"}</span>
          )}
        </span>
      );
    }

    return <span>{String(value)}</span>;
  };

  return (
    <pre className="font-mono text-sm leading-relaxed">
      <code>{renderValue(data, "root", "root")}</code>
    </pre>
  );
}
