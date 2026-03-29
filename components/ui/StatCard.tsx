import SpeakableCard from "./SpeakableCard";

type StatCardProps = {
  label: string;
  value: string;
  text: string;
  audioSrc?: string;
};

export default function StatCard({
  label,
  value,
  text,
  audioSrc,
}: StatCardProps) {
  return (
    <SpeakableCard
      text={`${label}. ${value}. ${text}`}
      audioSrc={audioSrc}
      className="p-4 md:p-5"
    >
      <p className="text-xs uppercase tracking-[0.18em] text-red-300 md:text-sm">
        {label}
      </p>
      <p className="mt-2 text-base font-bold leading-tight text-white md:text-lg">
        {value}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-white/65">{text}</p>
    </SpeakableCard>
  );
}
