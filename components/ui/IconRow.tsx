type IconRowProps = {
  icons: string[];
};

export default function IconRow({ icons }: IconRowProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {icons.map((src, index) => (
        <img
          key={`${src}-${index}`}
          src={src}
          alt={`rune icon ${index + 1}`}
          className="h-11 w-11 shrink-0 rounded-lg border border-red-500/30 bg-black/50 p-1 object-contain"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ))}
    </div>
  );
}
