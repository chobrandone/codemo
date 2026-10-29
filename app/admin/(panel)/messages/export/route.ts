import { NextResponse, type NextRequest } from "next/server";
import type { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { db } from "@/lib/db";

// CSV cell: quote, escape quotes, and neutralise spreadsheet formulas.
const cell = (v: unknown) => {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });
  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user?.active) return new NextResponse("Unauthorized", { status: 401 });

  const sp = req.nextUrl.searchParams;
  const where: Prisma.MessageWhereInput = {};
  if (sp.get("type")) where.inquiryType = sp.get("type")!;
  if (sp.get("status") === "unread") where.read = false;
  if (sp.get("status") === "read") where.read = true;

  const rows = await db.message.findMany({ where, orderBy: { createdAt: "desc" } });
  const header = ["Date", "Name", "Email", "Inquiry type", "Message", "Read", "IP"];
  const lines = [
    header.map(cell).join(","),
    ...rows.map((m) =>
      [m.createdAt.toISOString(), m.name, m.email, m.inquiryType, m.message, m.read ? "yes" : "no", m.ip].map(cell).join(","),
    ),
  ];
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="codemo-messages-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
