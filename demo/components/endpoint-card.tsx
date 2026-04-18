"use client";

interface EndpointCardProps {
  title: string;
  value: string;
  description: string;
  variant?: "default" | "primary" | "accent";
}

export function EndpointCard({
  title,
  value,
  description,
  variant = "default",
}: EndpointCardProps) {
  const borderColors = {
    default: "border-[var(--border)]",
    primary: "border-[var(--primary)]/30",
    accent: "border-[var(--accent)]/30",
  };

  const dotColors = {
    default: "bg-[var(--muted-foreground)]",
    primary: "bg-[var(--primary)]",
    accent: "bg-[var(--accent)]",
  };

  return (
    <div
      className={`rounded-lg border ${borderColors[variant]} bg-[var(--card)] p-5`}
    >
      <div className="flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${dotColors[variant]}`} />
        <span className="text-sm text-[var(--muted-foreground)]">{title}</span>
      </div>
      <div className="mt-2">
        <span className="text-2xl font-semibold text-[var(--foreground)]">
          {value}
        </span>
      </div>
      <p className="mt-1 text-xs text-[var(--muted-foreground)]">
        {description}
      </p>
    </div>
  );
}
