"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "gradient";
type Size = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
};

const variants: Record<Variant, string> = {
  primary: "bg-primary hover:bg-primary-hover text-white shadow-glow-sm hover:shadow-glow-primary",
  gradient: "bg-gradient-primary text-white hover:opacity-90 shadow-glow-sm hover:shadow-glow-primary",
  secondary: "bg-white/[0.06] hover:bg-white/[0.1] text-text-primary border border-border hover:border-border-strong",
  ghost: "bg-transparent hover:bg-white/[0.05] text-text-secondary hover:text-text-primary",
  danger: "bg-accent-rose/10 hover:bg-accent-rose/20 text-accent-rose border border-accent-rose/20",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
  md: "h-10 px-4 text-sm rounded-xl gap-2",
  lg: "h-12 px-6 text-base rounded-xl gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer select-none",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
    >
      {loading && <Loader2 className="animate-spin" size={14} />}
      {children}
    </motion.button>
  );
}
