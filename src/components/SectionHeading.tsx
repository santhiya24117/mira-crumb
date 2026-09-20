import { ScrollReveal } from './react-bits';

interface SectionHeadingProps {
  id?: string;
  subtitle?: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
  dark?: boolean;
}

export default function SectionHeading({
  id,
  subtitle,
  title,
  description,
  align = 'center',
  dark = false,
}: SectionHeadingProps) {
  const isCenter = align === 'center';

  return (
    <ScrollReveal
      id={id}
      duration={0.65}
      distance={16}
      blur={false}
      className={`max-w-2xl mb-12 sm:mb-16 ${
        isCenter ? 'mx-auto text-center' : 'text-left'
      }`}
    >
      {subtitle && (
        <span
          className={`text-xs uppercase tracking-[0.25em] font-sans font-semibold block mb-2.5 ${
            dark ? 'text-[#D8C3A5]' : 'text-[#4A263F]'
          }`}
        >
          {subtitle}
        </span>
      )}
      <h2
        className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.15] ${
          dark ? 'text-[#FFFFFF]' : 'text-[#292129]'
        }`}
      >
        {title}
      </h2>
      <div
        className={`w-12 h-[2px] bg-[#D8C3A5] my-4 ${
          isCenter ? 'mx-auto' : ''
        }`}
      />
      {description && (
        <p
          className={`text-base sm:text-lg font-light leading-relaxed ${
            dark ? 'text-[#F7F3F5]/80' : 'text-[#292129]/75'
          }`}
        >
          {description}
        </p>
      )}
    </ScrollReveal>
  );
}
