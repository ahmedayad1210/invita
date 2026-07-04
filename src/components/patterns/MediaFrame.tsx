import type { ReactNode } from "react";
import clsx from "clsx";

export type AssetVariant = "editorial" | "portrait" | "infographic" | "reel" | "inline" | "hero";

type MediaFrameProps = {
  variant?: AssetVariant;
  label?: string;
  caption?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Invita asset frame — every uploaded image/video passes through this
 * so dump assets match the site's espresso / ivory / rose design language.
 */
export default function MediaFrame({
  variant = "editorial",
  label,
  caption,
  className,
  children,
}: MediaFrameProps) {
  return (
    <figure
      className={clsx(
        "asset-frame",
        `asset-frame--${variant}`,
        label && "asset-frame--labeled",
        className,
      )}
    >
      {label ? <span className="asset-frame__label">{label}</span> : null}
      <div className="asset-frame__media">{children}</div>
      {variant === "editorial" || variant === "hero" ? (
        <div className="asset-frame__scrim" aria-hidden="true" />
      ) : null}
      {caption ? <figcaption className="asset-frame__caption">{caption}</figcaption> : null}
    </figure>
  );
}
