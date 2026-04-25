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
            ? "rounded-[1.65rem] border border-white/10 bg-[linear-gradient(180deg,rgba(18,18,21,0.74),rgba(7,7,9,0.7))] shadow-[0_24px_70px_rgba(0,0,0,0.34)] backdrop-blur-xl"
            : "rounded-[1.65rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,17,20,0.78),rgba(8,8,10,0.72))] shadow-[0_22px_60px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl",
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
