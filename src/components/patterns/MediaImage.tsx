import Image from "next/image";
import clsx from "clsx";
import MediaFrame, { type AssetVariant } from "./MediaFrame";

type MediaImageProps = {
  src: string;
  alt: string;
  variant?: AssetVariant;
  label?: string;
  caption?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
  frameClassName?: string;
  objectPosition?: string;
};

export default function MediaImage({
  src,
  alt,
  variant = "editorial",
  label,
  caption,
  fill,
  width,
  height,
  priority,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className,
  frameClassName,
  objectPosition = "center",
}: MediaImageProps) {
  const imageClass = clsx("asset-frame__image", className);

  return (
    <MediaFrame variant={variant} label={label} caption={caption} className={frameClassName}>
      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={imageClass}
          style={{ objectFit: "cover", objectPosition }}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width ?? 640}
          height={height ?? 480}
          priority={priority}
          sizes={sizes}
          className={imageClass}
          style={{ objectFit: "cover", objectPosition, width: "100%", height: "auto" }}
        />
      )}
    </MediaFrame>
  );
}
