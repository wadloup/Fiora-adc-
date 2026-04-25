import SpeakableCard from "./SpeakableCard";
import { cn } from "../../utils/cn";

type StatCardProps = {
  label: string;
  value: string;
  text: string;
  audioSrc?: string;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
  textClassName?: string;
};

export default function StatCard({
  label,
  value,
  text,
  audioSrc,
  className,
  labelClassName,
  valueClassName,
  textClassName,
}: StatCardProps) {
  return (
    <SpeakableCard
      text={`${label}. ${value}. ${text}`}
      audioSrc={audioSrc}
      className={cn("premium-hover-card p-4 md:p-5", className)}
    >
      <p
        className={cn(
          "text-xs uppercase tracking-[0.18em] text-white/52 md:text-sm",
          labelClassName
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "mt-2 text-base font-bold leading-tight text-white md:text-lg",
          valueClassName
        )}
      >
        {value}
      </p>
      <p
        className={cn(
          "mt-2 text-sm leading-relaxed text-white/65",
          textClassName
        )}
      >
        {text}
      </p>
    </SpeakableCard>
  );
}
