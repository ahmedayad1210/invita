"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Film, Instagram, LayoutGrid, Play } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import {
  formatInstagramCount,
  INSTAGRAM_PROFILE,
  postCaption,
  type InstagramPost,
} from "@/lib/invita/instagram";

const INITIAL_VISIBLE = 6;

type Filter = "all" | "reels" | "posts";

function TypeBadge({ type, isAr }: { type: InstagramPost["type"]; isAr: boolean }) {
  if (type === "reel") {
    return (
      <span className="instagram-type-badge instagram-type-badge--reel">
        <Play size={12} aria-hidden="true" />
        {isAr ? "ريل" : "Reel"}
      </span>
    );
  }
  if (type === "carousel") {
    return (
      <span className="instagram-type-badge">
        <LayoutGrid size={12} aria-hidden="true" />
        {isAr ? "ألبوم" : "Album"}
      </span>
    );
  }
  return null;
}

export default function InstagramFeed() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const profile = INSTAGRAM_PROFILE;
  const [filter, setFilter] = useState<Filter>("all");
  const [visible, setVisible] = useState(INITIAL_VISIBLE);

  const filtered = useMemo(() => {
    if (filter === "reels") return profile.posts.filter((p) => p.type === "reel");
    if (filter === "posts") return profile.posts.filter((p) => p.type !== "reel");
    return profile.posts;
  }, [filter, profile.posts]);

  const shown = filtered.slice(0, visible);
  const reelCount = profile.stats?.reels ?? profile.reels?.length ?? 0;
  const scrapedCount = profile.stats?.scraped ?? profile.posts.length;

  return (
    <section className="section-padding instagram-feed" aria-labelledby="instagram-heading">
      <div className="section-inner">
        <header className="instagram-header">
          <div className="instagram-profile">
            <div className="instagram-profile-avatar">
              <Image
                src={profile.profileImage}
                alt={profile.displayName}
                width={176}
                height={176}
                quality={92}
                className="instagram-profile-image"
              />
            </div>
            <div className="instagram-profile-copy">
              <p className="page-eyebrow">{isAr ? "تابعونا" : "Follow us"}</p>
              <h2 id="instagram-heading" className="page-title page-title--compact">
                @{profile.handle}
              </h2>
              <p className="instagram-bio">{isAr ? profile.bioAr : profile.bioEn}</p>
              <ul className="instagram-stats" aria-label={isAr ? "إحصائيات إنستغرام" : "Instagram stats"}>
                <li>
                  <strong>{formatInstagramCount(profile.postsCount)}</strong>
                  <span>{isAr ? "منشور" : "Posts"}</span>
                </li>
                <li>
                  <strong>{formatInstagramCount(profile.followers)}</strong>
                  <span>{isAr ? "متابع" : "Followers"}</span>
                </li>
                <li>
                  <strong>{formatInstagramCount(reelCount)}</strong>
                  <span>{isAr ? "ريل" : "Reels"}</span>
                </li>
              </ul>
              <Link
                href={profile.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary btn-sm instagram-follow-btn"
              >
                <Instagram size={16} aria-hidden="true" />
                {isAr ? "تابع على إنستغرام" : "Follow on Instagram"}
              </Link>
            </div>
          </div>
        </header>

        {profile.themes.length > 0 && (
          <ul className="instagram-themes">
            {profile.themes.slice(0, 6).map((theme) => (
              <li key={theme}>{theme}</li>
            ))}
          </ul>
        )}

        <div className="instagram-highlights">
          <p className="instagram-highlights-label">
            {isAr ? "القصص المميزة" : "Story highlights"}
          </p>
          <ul className="instagram-highlights-list">
            {profile.highlights.map((item) => (
              <li key={item.id}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="instagram-highlight-pill"
                >
                  {isAr ? item.labelAr : item.labelEn}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="instagram-toolbar">
          <div className="instagram-filters" role="tablist" aria-label={isAr ? "تصفية المحتوى" : "Filter content"}>
            {(
              [
                ["all", isAr ? "الكل" : "All", profile.posts.length],
                ["reels", isAr ? "ريلز" : "Reels", reelCount],
                ["posts", isAr ? "منشورات" : "Posts", profile.posts.length - reelCount],
              ] as const
            ).map(([key, label, count]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={filter === key}
                className={`instagram-filter-btn${filter === key ? " is-active" : ""}`}
                onClick={() => {
                  setFilter(key);
                  setVisible(INITIAL_VISIBLE);
                }}
              >
                {label}
                <span className="instagram-filter-count">{count}</span>
              </button>
            ))}
          </div>
          <p className="instagram-scrape-note">
            {isAr
              ? `${scrapedCount} من ${profile.postsCount} · WebP${profile.stats?.avgPhotoWidth ? ` · صور ~${profile.stats.avgPhotoWidth}px` : ""}`
              : `${scrapedCount} of ${profile.postsCount} · HQ WebP${profile.stats?.avgPhotoWidth ? ` · photos ~${profile.stats.avgPhotoWidth}px` : ""}`}
          </p>
        </div>

        <div className="instagram-grid">
          {shown.map((post) => {
            const caption = postCaption(post, locale);
            return (
              <a
                key={post.shortcode || post.id}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-tile"
                title={caption}
              >
                <Image
                  src={post.image}
                  alt={caption || `@${profile.handle}`}
                  width={post.imageWidth ?? 1080}
                  height={post.imageHeight ?? 1080}
                  quality={92}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px"
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
                <TypeBadge type={post.type} isAr={isAr} />
                {caption && (
                  <span className="instagram-tile-caption">{caption.slice(0, 80)}{caption.length > 80 ? "…" : ""}</span>
                )}
                <span className="instagram-tile-overlay">
                  <ExternalLink size={18} aria-hidden="true" />
                </span>
              </a>
            );
          })}
        </div>

        <div className="instagram-actions">
          {visible < filtered.length && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setVisible((v) => v + 8)}
            >
              {isAr ? "عرض المزيد" : "Show more"}
            </button>
          )}
          <Link
            href={profile.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary btn-sm"
          >
            <Film size={16} aria-hidden="true" />
            {isAr ? "شاهد الكل على إنستغرام" : "View all on Instagram"}
          </Link>
        </div>

        {profile.partners && profile.partners.length > 0 && (
          <div className="instagram-partners">
            <p className="instagram-partners-label">
              {isAr ? "شركاؤنا على إنستغرام" : "Featured partners on Instagram"}
            </p>
            <ul className="instagram-partners-list">
              {profile.partners.map((partner) => (
                <li key={partner.name}>
                  {partner.postUrl ? (
                    <a href={partner.postUrl} target="_blank" rel="noopener noreferrer">
                      <strong>{isAr ? partner.nameAr : partner.name}</strong>
                      <span>{isAr ? partner.specialtyAr : partner.specialty}</span>
                    </a>
                  ) : (
                    <>
                      <strong>{isAr ? partner.nameAr : partner.name}</strong>
                      <span>{isAr ? partner.specialtyAr : partner.specialty}</span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
