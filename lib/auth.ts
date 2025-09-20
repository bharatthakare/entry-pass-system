import { supabase } from "./supabase";

export async function signInAdmin(email: string, password: string) {
  // Supabase email/password auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // check admins table
  const user = data.user;
  if (!user) return { success: false, error: "No user returned" };

  const { data: admin, error: adminError } = await supabase
    .from("admins")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (adminError || !admin) {
    return { success: false, error: "Not an admin" };
  }

  return { success: true };
}

export async function isAdminLoggedIn() {
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

export async function logoutAdmin() {
  await supabase.auth.signOut();
}
