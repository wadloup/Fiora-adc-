import NeonCard from "./NeonCard";

type StatCardProps = {
  label: string;
  value: string;
  text: string;
};

export default function StatCard({
  label,
  value,
  text,
}: StatCardProps) {
  return (
    <NeonCard className="p-5">
      <p className="text-sm uppercase tracking-[0.18em] text-red-300">
        {label}
      </p>
      <p className="mt-2 text-lg font-bold text-white">{value}</p>
      <p className="mt-2 text-sm text-white/65">{text}</p>
    </NeonCard>
  );
}
