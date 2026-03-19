type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] uppercase tracking-[0.34em] text-signal/85">
        {eyebrow}
      </p>
      <h2 className="font-serif text-3xl text-white sm:text-4xl">{title}</h2>
      {description ? (
        <p className="max-w-3xl text-sm leading-7 text-fog">{description}</p>
      ) : null}
    </div>
  );
}
