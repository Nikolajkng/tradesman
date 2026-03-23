import "server-only";

import twilio from "twilio";

export type SmsPayload = {
  to: string;
  body: string;
};

type SmsResult = {
  mode: "mock" | "live";
  sid: string;
  to: string;
  body: string;
  status: string;
};

const requiredEnvVars = [
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN",
  "TWILIO_PHONE_NUMBER",
] as const;

function getMissingEnvVars() {
  return requiredEnvVars.filter((key) => !process.env[key]?.trim());
}

function shouldUseMock(forceMock?: boolean) {
  if (forceMock) {
    return true;
  }

  return getMissingEnvVars().length > 0;
}

export function getTwilioSetupStatus() {
  const missing = getMissingEnvVars();

  return {
    isConfigured: missing.length === 0,
    missing,
  };
}

export async function sendSms(
  payload: SmsPayload,
  options?: { forceMock?: boolean }
): Promise<SmsResult> {
  const { to, body } = payload;
  const useMock = shouldUseMock(options?.forceMock);

  if (useMock) {
    return {
      mode: "mock",
      sid: `mock_${Date.now()}`,
      to,
      body,
      status: "queued",
    };
  }

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  );

  const message = await client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER!,
    to,
    body,
  });

  return {
    mode: "live",
    sid: message.sid,
    to: message.to,
    body: message.body ?? body,
    status: message.status ?? "queued",
  };
}
