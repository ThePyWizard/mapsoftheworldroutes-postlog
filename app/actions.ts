"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

export async function togglePosted(id: string, next: boolean) {
  const { data, error } = await supabase
    .from("contents")
    .update({ posted: next })
    .eq("id", id)
    .select();
  if (error) {
    console.error("[togglePosted] supabase error:", error);
    throw new Error(error.message);
  }
  if (!data || data.length === 0) {
    console.error("[togglePosted] update affected 0 rows — likely RLS missing UPDATE policy on contents");
    throw new Error("Update silently blocked. Add an UPDATE policy to public.contents in Supabase.");
  }
  revalidatePath("/");
}

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (password !== process.env.SITE_PASSWORD) {
    redirect("/login?error=1");
  }
  const jar = await cookies();
  jar.set("auth", "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/");
}

export async function logout() {
  const jar = await cookies();
  jar.delete("auth");
  redirect("/login");
}
