import { cn } from "@/lib/utils";

type Variant = "primary" | "cyan" | "green" | "amber" | "rose" | "ghost";

const variants: Record<Variant, string> = {
  primary: "bg-primary/15 text-primary-light border border-primary/25",
  cyan: "bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20",
  green: "bg-accent-green/10 text-accent-green border border-accent-green/20",
  amber: "bg-accent-amber/10 text-accent-amber border border-accent-amber/20",
  rose: "bg-accent-rose/10 text-accent-rose border border-accent-rose/20",
  ghost: "bg-white/[0.06] text-text-secondary border border-border",
};

type BadgeProps = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
};

export function Badge({ variant = "ghost", className, children }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase", variants[variant], className)}>
      {children}
    </span>
  );
}
