/**
 * Generates public/feed.json at build time so the portfolio (and others) can
 * fetch posts without hitting the blog's API or Supabase at runtime.
 * Run before build: node scripts/generate-feed.js
 * If Supabase env is missing or fetch fails, writes an empty feed so build still succeeds.
 */

import { createClient } from "@supabase/supabase-js";
import { writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const MAX_POSTS = 100;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const emptyFeed = () => ({
  posts: [],
  pagination: { total: 0, page: 1, limit: MAX_POSTS, totalPages: 0 },
});

async function generate() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("generate-feed: Missing Supabase env (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY), writing empty feed.");
    writeFeed(emptyFeed());
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Fetch posts; if the tags join fails at build time, retry without it so we still get posts
  let posts = [];

  const { data: postsWithTags, error: errWithTags } = await supabase
    .from("posts")
    .select(
      `
      id,
      title,
      slug,
      content,
      image_url,
      created_at,
      updated_at,
      posts_tags(
        tag_id,
        tags(id, name, slug)
      )
    `
    )
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(MAX_POSTS);

  if (!errWithTags && postsWithTags?.length) {
    posts = postsWithTags;
  } else {
    if (errWithTags) {
      console.warn("generate-feed: Query with tags failed:", errWithTags.message, "- trying without tags.");
    }
    const { data: postsOnly, error: errOnly } = await supabase
      .from("posts")
      .select("id, title, slug, content, image_url, created_at, updated_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(MAX_POSTS);

    if (errOnly) {
      console.warn("generate-feed: Supabase error, writing empty feed:", errOnly.message);
      writeFeed(emptyFeed());
      return;
    }
    posts = postsOnly || [];
  }

  const processedPosts = posts.map((post) => {
    const excerpt = post.content
      ? post.content
          .replace(/\s+/g, " ")
          .replace(/#|==|\*\*|__|\*|_|`|>/g, "")
          .trim()
          .substring(0, 160) + (post.content.length > 160 ? "..." : "")
      : "";
    const tags = (post.posts_tags || [])
      .map((pt) => pt.tags)
      .filter(Boolean);
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt,
      image_url: post.image_url || undefined,
      created_at: post.created_at,
      tags,
    };
  });

  const feed = {
    posts: processedPosts,
    pagination: {
      total: processedPosts.length,
      page: 1,
      limit: MAX_POSTS,
      totalPages: Math.ceil(processedPosts.length / MAX_POSTS) || 0,
    },
  };

  writeFeed(feed);
  console.log("generate-feed: Wrote feed.json with", processedPosts.length, "posts.");
  if (processedPosts.length === 0) {
    console.warn("generate-feed: No posts found. Check Supabase RLS allows anon SELECT on posts where published=true, and env is set for Build (not only Runtime) in Vercel.");
  }
}

function writeFeed(feed) {
  const publicDir = join(__dirname, "..", "public");
  mkdirSync(publicDir, { recursive: true });
  const path = join(publicDir, "feed.json");
  writeFileSync(path, JSON.stringify(feed, null, 0), "utf8");
}

generate().catch((err) => {
  console.warn("generate-feed: Error, writing empty feed:", err.message);
  writeFeed(emptyFeed());
});
