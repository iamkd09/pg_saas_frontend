import { cn } from "@/lib/utils";

const variants = {
  default: "bg-secondary text-secondary-foreground",
  success: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  warning: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  danger: "bg-destructive/15 text-destructive",
  info: "bg-primary/10 text-primary",
} as const;

export function Badge({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & { variant?: keyof typeof variants }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export function statusBadgeVariant(
  status: string
): keyof typeof variants {
  switch (status) {
    case "PAID":
    case "RESOLVED":
    case "ACTIVE":
    case "VACANT":
      return "success";
    case "PENDING":
    case "OPEN":
      return "warning";
    case "OVERDUE":
    case "IN_PROGRESS":
      return "info";
    case "PARTIAL":
      return "info";
    case "OCCUPIED":
    case "LEFT":
      return "default";
    default:
      return "default";
  }
}
