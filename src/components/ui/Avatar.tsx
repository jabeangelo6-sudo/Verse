import { cn } from "@/lib/utils";
import Image from "next/image";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

const sizes: Record<Size, { outer: string; inner: string; img: number }> = {
  xs: { outer: "w-6 h-6", inner: "w-6 h-6", img: 24 },
  sm: { outer: "w-8 h-8", inner: "w-8 h-8", img: 32 },
  md: { outer: "w-10 h-10", inner: "w-10 h-10", img: 40 },
  lg: { outer: "w-14 h-14", inner: "w-14 h-14", img: 56 },
  xl: { outer: "w-20 h-20", inner: "w-20 h-20", img: 80 },
};

type AvatarProps = {
  src: string;
  alt: string;
  size?: Size;
  ring?: boolean;
  online?: boolean;
  className?: string;
};

export function Avatar({ src, alt, size = "md", ring = false, online = false, className }: AvatarProps) {
  const s = sizes[size];

  const img = (
    <div className={cn("relative rounded-full overflow-hidden bg-bg-elevated flex-shrink-0", s.inner, className)}>
      <Image src={src} alt={alt} width={s.img} height={s.img} className="object-cover w-full h-full" />
      {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-accent-green rounded-full border-2 border-bg-base" />
      )}
    </div>
  );

  if (ring) {
    return (
      <div className={cn("avatar-ring flex-shrink-0", s.outer)}>
        <div className={cn("rounded-full overflow-hidden", s.inner)}>
          <Image src={src} alt={alt} width={s.img} height={s.img} className="object-cover w-full h-full" />
        </div>
      </div>
    );
  }

  return img;
}
