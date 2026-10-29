"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendContactNotification } from "@/lib/mail";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "inquiryType" | "message", string>>;
  values?: Record<string, string>;
};

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address.").max(200),
  inquiryType: z.string().trim().min(1, "Please choose an option.").max(80),
  message: z.string().trim().min(10, "Please write a message of at least 10 characters.").max(5000),
});

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    inquiryType: String(formData.get("inquiryType") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  // Honeypot: real visitors never fill the hidden "website" field.
  if (String(formData.get("website") ?? "") !== "") {
    return { status: "success" };
  }
  // Submissions faster than 2s after render are almost always bots.
  const started = Number(formData.get("ts") ?? 0);
  if (started && Date.now() - started < 2000) {
    return { status: "error", message: "Please take a moment before sending.", values: raw };
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const errors: ContactState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0] as keyof NonNullable<ContactState["errors"]>;
      errors[k] ??= issue.message;
    }
    return { status: "error", message: "Please check the highlighted fields.", errors, values: raw };
  }

  const ip = await clientIp();
  if (!(await rateLimit(`contact:${ip}`, 5, 60 * 60))) {
    return {
      status: "error",
      message: "Too many messages from your connection. Please try again later or contact us on WhatsApp.",
      values: raw,
    };
  }

  const ua = (await headers()).get("user-agent")?.slice(0, 300) ?? null;
  const record = await db.message.create({ data: { ...parsed.data, ip, userAgent: ua } });

  try {
    const sent = await sendContactNotification(parsed.data);
    if (sent) await db.message.update({ where: { id: record.id }, data: { emailSent: true } });
  } catch (err) {
    // The message is safely stored; email failure is logged but not shown to the visitor.
    console.error("[contact] email notification failed:", err);
  }

  return { status: "success" };
}
