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
            ? "premium-panel rounded-3xl border border-red-500/25 bg-[rgba(20,6,10,0.72)] shadow-[0_0_24px_rgba(255,0,60,0.12)]"
            : "premium-panel rounded-3xl border border-red-500/25 bg-[rgba(18,7,10,0.76)] shadow-[0_0_24px_rgba(255,0,60,0.12)]",
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
