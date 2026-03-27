import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!,
);

export async function POST(request: Request) {
  try {
    const { to, message } = await request.json();

    if (!to || !message) {
      return Response.json(
        { ok: false, error: "Missing 'to' or 'message'" },
        { status: 400 },
      );
    }

    const res = await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER!,
      to,
      body: message,
    });

    return Response.json({
      ok: true,
      sid: res.sid,
      status: res.status,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";

    return Response.json({ ok: false, error: errorMessage }, { status: 500 });
  }
}
