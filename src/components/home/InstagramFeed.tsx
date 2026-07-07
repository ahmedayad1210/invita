"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Film, Heart, Instagram, LayoutGrid, Play, ShoppingBag } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import {
  formatInstagramCount,
  INSTAGRAM_PROFILE,
  postCaption,
  type InstagramPost,
} from "@/lib/invita/instagram";
import {
  INSTAGRAM_TOPICS,
  inferPostTopic,
  postMatchesTopic,
} from "@/lib/invita/instagram-topics";

const INITIAL_VISIBLE = 6;

type TypeFilter = "all" | "reels" | "posts";
type TopicFilter = "all" | string;

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

function PostTile({
  post,
  isAr,
  profileHandle,
}: {
  post: InstagramPost;
  isAr: boolean;
  profileHandle: string;
}) {
  const caption = postCaption(post, isAr ? "ar" : "en");
  const topic = inferPostTopic(caption);
  const dripHref = topic?.dripSlug ? `/iv-therapy/${topic.dripSlug}` : null;

  const image = (
    <>
      <Image
        src={post.image}
        alt={caption || `@${profileHandle}`}
        width={post.imageWidth ?? 1080}
        height={post.imageHeight ?? 1080}
        quality={92}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px"
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
      />
      <TypeBadge type={post.type} isAr={isAr} />
      {topic && (
        <span className="instagram-topic-badge">
          <ShoppingBag size={11} aria-hidden="true" />
          {isAr ? topic.labelAr : topic.labelEn}
        </span>
      )}
      {post.likes != null && post.likes > 0 && (
        <span className="instagram-likes-badge">
          <Heart size={11} aria-hidden="true" />
          {formatInstagramCount(post.likes)}
        </span>
      )}
      {caption && (
        <span className="instagram-tile-caption">
          {caption.slice(0, 80)}
          {caption.length > 80 ? "…" : ""}
        </span>
      )}
    </>
  );

  if (dripHref) {
    return (
      <div className="instagram-tile instagram-tile--shoppable">
        <Link href={dripHref} className="instagram-tile-main" title={caption}>
          {image}
          <span className="instagram-tile-overlay instagram-tile-overlay--shop">
            {isAr ? "عرض البروتوكول" : "View protocol"}
          </span>
        </Link>
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="instagram-tile-ig-link"
          title={isAr ? "فتح على إنستغرام" : "Open on Instagram"}
          aria-label={isAr ? "فتح على إنستغرام" : "Open on Instagram"}
        >
          <ExternalLink size={14} aria-hidden="true" />
        </a>
      </div>
    );
  }

  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className="instagram-tile"
      title={caption}
    >
      {image}
      <span className="instagram-tile-overlay">
        <ExternalLink size={18} aria-hidden="true" />
      </span>
    </a>
  );
}

export default function InstagramFeed() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const profile = INSTAGRAM_PROFILE;
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [topicFilter, setTopicFilter] = useState<TopicFilter>("all");
  const [visible, setVisible] = useState(INITIAL_VISIBLE);

  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = { all: profile.posts.length };
    for (const topic of INSTAGRAM_TOPICS) {
      counts[topic.id] = profile.posts.filter((p) =>
        postMatchesTopic(postCaption(p, "en"), topic.id)
      ).length;
    }
    return counts;
  }, [profile.posts]);

  const filtered = useMemo(() => {
    let posts = profile.posts;

    if (typeFilter === "reels") posts = posts.filter((p) => p.type === "reel");
    if (typeFilter === "posts") posts = posts.filter((p) => p.type !== "reel");

    if (topicFilter !== "all") {
      posts = posts.filter((p) =>
        postMatchesTopic(postCaption(p, "en"), topicFilter)
      );
    }

    return posts;
  }, [typeFilter, topicFilter, profile.posts]);

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
                aria-selected={typeFilter === key}
                className={`instagram-filter-btn${typeFilter === key ? " is-active" : ""}`}
                onClick={() => {
                  setTypeFilter(key);
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

        <div className="instagram-topic-filters" role="tablist" aria-label={isAr ? "تصفية حسب الموضوع" : "Filter by topic"}>
          <button
            type="button"
            role="tab"
            aria-selected={topicFilter === "all"}
            className={`instagram-topic-btn${topicFilter === "all" ? " is-active" : ""}`}
            onClick={() => {
              setTopicFilter("all");
              setVisible(INITIAL_VISIBLE);
            }}
          >
            {isAr ? "كل المواضيع" : "All topics"}
            <span className="instagram-filter-count">{topicCounts.all}</span>
          </button>
          {INSTAGRAM_TOPICS.map((topic) => (
            <button
              key={topic.id}
              type="button"
              role="tab"
              aria-selected={topicFilter === topic.id}
              className={`instagram-topic-btn${topicFilter === topic.id ? " is-active" : ""}`}
              onClick={() => {
                setTopicFilter(topic.id);
                setVisible(INITIAL_VISIBLE);
              }}
            >
              {isAr ? topic.labelAr : topic.labelEn}
              <span className="instagram-filter-count">{topicCounts[topic.id] ?? 0}</span>
            </button>
          ))}
        </div>

        <div className="instagram-grid">
          {shown.map((post) => (
            <PostTile
              key={post.shortcode || post.id}
              post={post}
              isAr={isAr}
              profileHandle={profile.handle}
            />
          ))}
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
