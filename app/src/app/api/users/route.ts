import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return user;
}

export async function GET() {
  const user = await requireUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return Response.json({ data: "GET response", userId: user.id });
}

export async function POST(request: Request) {
  const user = await requireUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  return Response.json({
    received: body,
    userId: user.id,
  });
}

export async function PUT() {
  const user = await requireUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return Response.json({ message: "Updated", userId: user.id });
}

export async function DELETE() {
  const user = await requireUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return Response.json({ message: "Deleted", userId: user.id });
}
