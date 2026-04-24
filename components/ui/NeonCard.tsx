import React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type NeonCardProps = {
  className?: string;
  children: React.ReactNode;
  noBlur?: boolean;
};

const NeonCard = React.forwardRef<HTMLDivElement, NeonCardProps>(
  ({ className = "", children, noBlur = false }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          noBlur
            ? "premium-surface premium-surface-solid rounded-3xl border border-red-500/25"
            : "premium-surface rounded-3xl border border-red-500/25",
          className
        )}
      >
        {children}
      </div>
    );
  }
);

NeonCard.displayName = "NeonCard";

export default NeonCard;
