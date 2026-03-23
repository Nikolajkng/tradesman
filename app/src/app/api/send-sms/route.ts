import { NextResponse } from "next/server";

import { getTwilioSetupStatus, sendSms } from "@/lib/twilio";

type RequestBody = {
  to?: string;
  body?: string;
  useMock?: boolean;
};

function isValidPhoneNumber(value: string) {
  return /^\+\d{8,15}$/.test(value);
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as RequestBody;
    const to = data.to?.trim();
    const body = data.body?.trim();
    const useMock = Boolean(data.useMock);

    if (!to || !body) {
      return NextResponse.json(
        { error: "Both 'to' and 'body' are required." },
        { status: 400 }
      );
    }

    if (!isValidPhoneNumber(to)) {
      return NextResponse.json(
        { error: "Phone number must be in E.164 format, for example +4512345678." },
        { status: 400 }
      );
    }

    const result = await sendSms(
      { to, body },
      {
        forceMock: useMock,
      }
    );

    const setup = getTwilioSetupStatus();

    return NextResponse.json({
      ok: true,
      result,
      twilioConfigured: setup.isConfigured,
      missingEnvVars: setup.missing,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error while sending SMS.";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
