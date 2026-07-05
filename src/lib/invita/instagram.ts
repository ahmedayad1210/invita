import raw from "@/data/instagram.json";

export type InstagramHighlight = {
  id: string;
  labelEn: string;
  labelAr: string;
  url: string;
};

export type InstagramPost = {
  id: string;
  shortcode?: string;
  type: "photo" | "carousel" | "reel" | "video";
  url: string;
  image: string;
  imageWidth?: number | null;
  imageHeight?: number | null;
  imageBytes?: number | null;
  captionEn: string;
  captionAr: string;
  likes?: number | null;
  comments?: number | null;
  timestamp?: string | null;
};

export type InstagramPartner = {
  name: string;
  nameAr: string;
  specialty: string;
  specialtyAr: string;
  postUrl?: string;
};

export type InstagramProfile = {
  handle: string;
  displayName: string;
  profileUrl: string;
  websiteUrl: string;
  bioEn: string;
  bioAr: string;
  followers: number;
  following: number;
  postsCount: number;
  category?: string;
  contactPhone?: string;
  businessAddress?: {
    city_name?: string;
    latitude?: number;
    longitude?: number;
  } | null;
  bioLinks?: { title: string; url: string }[];
  scrapedAt: string;
  profileImage: string;
  highlights: InstagramHighlight[];
  posts: InstagramPost[];
  reels?: InstagramPost[];
  partners?: InstagramPartner[];
  themes: string[];
  stats?: {
    scraped: number;
    reels: number;
    photos: number;
    carousels: number;
    totalOnProfile: number;
    avgImageWidth?: number;
    avgPhotoWidth?: number;
  };
  imageFormat?: string;
  imageQuality?: number;
};

export const INSTAGRAM_PROFILE = raw as InstagramProfile;

export function formatInstagramCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 10_000) return `${Math.round(n / 1_000)}K`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return n.toLocaleString();
}

export function postCaption(post: InstagramPost, locale: "en" | "ar"): string {
  if (locale === "ar" && post.captionAr) return post.captionAr;
  return post.captionEn || post.captionAr || "";
}
