type IconRowProps = {
  icons: string[];
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
};

export default function IconRow({ icons, onError }: IconRowProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {icons.map((src, index) => (
        <img
          key={`${src}-${index}`}
          src={src}
          alt="rune icon"
          className="h-14 w-14 rounded-xl border border-red-500/30 bg-black/50 object-cover"
          onError={onError}
        />
      ))}
    </div>
  );
}
