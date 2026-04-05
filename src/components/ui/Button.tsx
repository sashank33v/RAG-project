import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export default function Button({
  children,
  className,
  variant = "primary",
  ...props
}: Props) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-medium transition-all duration-200 active:scale-[0.98] focus:outline-none",
        variant === "primary" &&
          "bg-white text-black hover:opacity-90 shadow-[0_10px_30px_rgba(255,255,255,0.08)]",
        variant === "secondary" &&
          "border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
