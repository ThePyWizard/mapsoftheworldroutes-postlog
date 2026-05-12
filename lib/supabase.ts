import { createClient } from "@supabase/supabase-js";

export type Post = {
  id: string;
  post_id: number;
  caption: string;
  video_url: string;
  posted: boolean;
  created_at: string;
};

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
