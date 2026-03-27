import { createClient } from "@/lib/supabase/server";

export async function GET({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  return Response.json({
    message: "Dynamic route works",
    userId: id,
    authenticatedUserId: user.id,
  });
}
