import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("Missing RESEND_API_KEY in env");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

export async function sendEmail(options: EmailOptions) {
  const {
    to,
    subject,
    html = "",
    text,
    from = "Bubbly Maps <hello@bubblymaps.org>",
  } = options;

  try {
    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
    });
    return result;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to send email";
    console.error("Error sending email:", error);
    throw new Error(errorMessage);
  }
}
