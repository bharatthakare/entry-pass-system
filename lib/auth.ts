// lib/auth.ts
import { supabase } from "./supabase";

/** Sign in admin and mark local flag for quick UI checks */
export async function signInAdmin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { success: false, error: error.message };
  const user = data.user;
  if (!user) return { success: false, error: "No user returned" };

  const { data: admin, error: adminError } = await supabase
    .from("admins")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError || !admin) return { success: false, error: "Not an admin" };

  if (typeof window !== "undefined")
    localStorage.setItem("admin_logged_in", "true");
  return { success: true };
}

/** quick, synchronous UI check (safe for setState) */
export function isAdminLoggedInLocal(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("admin_logged_in") === "true";
}

/** secure server check (async) — use when you need to verify session content */
export async function isAdminLoggedInRemote(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  if (!user) return false;

  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  return !!admin;
}

/** sign out and clear local flag */
export async function logoutAdmin() {
  await supabase.auth.signOut();
  if (typeof window !== "undefined") localStorage.removeItem("admin_logged_in");
}
