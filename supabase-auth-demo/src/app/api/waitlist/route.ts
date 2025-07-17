import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const { name, email, userType } = await req.json();
  if (!name || !email || !userType) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  // Check for duplicate email
  const { data: existing, error: selectError } = await supabase
    .from("waitlist")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (selectError) {
    return NextResponse.json({ error: selectError.message }, { status: 500 });
  }
  if (existing) {
    return NextResponse.json({ error: "This email is already on the waitlist." }, { status: 409 });
  }
  const { error } = await supabase.from("waitlist").insert([{ name, email, userType }]);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
} 