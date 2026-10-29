import "server-only";
import nodemailer from "nodemailer";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function mailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.CONTACT_RECEIVER_EMAIL);
}

let transporter: nodemailer.Transporter | null = null;
function getTransporter() {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT || 465);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } : undefined,
    });
  }
  return transporter;
}

export async function sendContactNotification(msg: {
  name: string;
  email: string;
  inquiryType: string;
  message: string;
}) {
  if (!mailConfigured()) return false;
  const site = process.env.NEXT_PUBLIC_SITE_URL || "";
  await getTransporter().sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.CONTACT_RECEIVER_EMAIL,
    replyTo: `"${msg.name.replace(/"/g, "")}" <${msg.email}>`,
    subject: `New inquiry (${msg.inquiryType}) — ${msg.name}`,
    text: `Name: ${msg.name}\nEmail: ${msg.email}\nContacting as: ${msg.inquiryType}\n\n${msg.message}\n\n— ${site}/admin/messages`,
    html: `<div style="font-family:Arial,sans-serif;color:#202820;max-width:600px">
      <h2 style="color:#1F5B36;font-family:Georgia,serif">New message from the CODEMO website</h2>
      <table style="border-collapse:collapse;font-size:14px">
        <tr><td style="padding:4px 12px 4px 0;color:#667066">Name</td><td><strong>${esc(msg.name)}</strong></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#667066">Email</td><td><a href="mailto:${esc(msg.email)}">${esc(msg.email)}</a></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#667066">Contacting as</td><td>${esc(msg.inquiryType)}</td></tr>
      </table>
      <p style="white-space:pre-wrap;background:#F7F3E9;padding:16px;border-left:3px solid #D6A738;font-size:14px;line-height:1.6">${esc(msg.message)}</p>
      <p style="font-size:12px;color:#667066"><a href="${esc(site)}/admin/messages">Open the inbox</a></p>
    </div>`,
  });
  return true;
}
