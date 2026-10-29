import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MessageTable } from "./message-table";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const where: Prisma.MessageWhereInput = {};
  if (sp.type) where.inquiryType = sp.type;
  if (sp.status === "unread") where.read = false;
  if (sp.status === "read") where.read = true;
  if (sp.q)
    where.OR = [
      { name: { contains: sp.q, mode: "insensitive" } },
      { email: { contains: sp.q, mode: "insensitive" } },
      { message: { contains: sp.q, mode: "insensitive" } },
    ];

  const [messages, types, unread, total] = await Promise.all([
    db.message.findMany({ where, orderBy: { createdAt: "desc" }, take: 500 }),
    db.message.groupBy({ by: ["inquiryType"], _count: true, orderBy: { inquiryType: "asc" } }),
    db.message.count({ where: { read: false } }),
    db.message.count(),
  ]);

  const qs = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { type: sp.type, status: sp.status, q: sp.q, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
    const s = p.toString();
    return s ? `?${s}` : "";
  };

  const chip = (label: string, href: string, active: boolean, count?: number) => (
    <Link
      key={label}
      href={`/admin/messages${href}`}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition",
        active ? "border-primary bg-primary text-white" : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300",
      )}
    >
      {label}
      {count !== undefined && <span className={cn("ml-1.5", active ? "text-white/80" : "text-zinc-400")}>{count}</span>}
    </Link>
  );

  return (
    <>
      <PageHeader
        title="Messages"
        description={`${total} total · ${unread} unread. Every contact form submission is stored here.`}
        actions={
          <Button variant="outline" asChild>
            <a href={`/admin/messages/export${qs({})}`}>
              <Download /> Export CSV
            </a>
          </Button>
        }
      />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {chip("All", qs({ status: undefined }), !sp.status)}
        {chip("Unread", qs({ status: "unread" }), sp.status === "unread", unread)}
        {chip("Read", qs({ status: "read" }), sp.status === "read")}
        <span className="mx-2 h-4 w-px bg-zinc-200" />
        {chip("Any type", qs({ type: undefined }), !sp.type)}
        {types.map((t) => chip(t.inquiryType, qs({ type: t.inquiryType }), sp.type === t.inquiryType, t._count))}
        <form className="ml-auto" action="/admin/messages">
          {sp.type && <input type="hidden" name="type" value={sp.type} />}
          {sp.status && <input type="hidden" name="status" value={sp.status} />}
          <input
            name="q"
            defaultValue={sp.q}
            placeholder="Search…"
            className="h-8 w-48 rounded-md border border-zinc-200 bg-white px-3 text-sm focus:border-primary focus:outline-none"
          />
        </form>
      </div>
      <Card>
        <MessageTable messages={messages.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() }))} />
      </Card>
    </>
  );
}
