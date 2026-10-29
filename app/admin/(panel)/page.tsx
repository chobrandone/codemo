import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, FolderKanban, Image as ImageIcon, Inbox, Settings, Sprout } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth-guard";
import { mailConfigured } from "@/lib/mail";
import { Badge, Card, CardHeader, PageHeader } from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

export default async function Dashboard() {
  const user = await requireUser();
  const [unread, messages, activities, projects, media, recent] = await Promise.all([
    db.message.count({ where: { read: false } }),
    db.message.count(),
    db.activity.count({ where: { locale: "en" } }),
    db.project.count({ where: { locale: "en" } }),
    db.media.count(),
    db.message.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  const stats = [
    { label: "Unread messages", value: unread, href: "/admin/messages?status=unread", icon: Inbox, highlight: unread > 0 },
    { label: "Total messages", value: messages, href: "/admin/messages", icon: Inbox },
    { label: "Activities", value: activities, href: "/admin/activities", icon: Sprout },
    { label: "Expansion projects", value: projects, href: "/admin/projects", icon: FolderKanban },
  ];
  const quick = [
    { label: "Edit home page", href: "/admin/pages/home", icon: FileText },
    { label: "Add an activity", href: "/admin/activities/new", icon: Sprout },
    { label: `Media library (${media})`, href: "/admin/media", icon: ImageIcon },
    { label: "Site settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <>
      <PageHeader title={`Welcome${user.name ? `, ${user.name.split(" ")[0]}` : ""}`} description="Everything you change here is published to the website immediately." />

      {!mailConfigured() && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Email notifications are off — set <code className="font-mono">SMTP_HOST</code> and{" "}
          <code className="font-mono">CONTACT_RECEIVER_EMAIL</code> to receive contact form messages by email. Messages are still saved here.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className={cn("p-5 transition hover:shadow-md", s.highlight && "border-gold bg-amber-50/60")}>
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500">{s.label}</p>
                <s.icon className={cn("h-4 w-4", s.highlight ? "text-gold" : "text-zinc-400")} />
              </div>
              <p className={cn("mt-3 text-3xl font-semibold tabular-nums", s.highlight ? "text-earth" : "text-zinc-900")}>{s.value}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader
            title="Latest messages"
            actions={
              <Link href="/admin/messages" className="text-sm text-primary hover:underline">
                View all
              </Link>
            }
          />
          {recent.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-zinc-500">No messages yet.</p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {recent.map((m) => (
                <li key={m.id}>
                  <Link href="/admin/messages" className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-50">
                    {!m.read && <span className="h-2 w-2 shrink-0 rounded-full bg-gold" aria-label="Unread" />}
                    <div className="min-w-0 flex-1">
                      <p className={cn("truncate text-sm", !m.read && "font-semibold")}>{m.name}</p>
                      <p className="truncate text-xs text-zinc-500">{m.message}</p>
                    </div>
                    <Badge tone="green">{m.inquiryType}</Badge>
                    <span className="hidden whitespace-nowrap text-xs text-zinc-400 sm:inline">{formatDate(m.createdAt)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card className="h-fit">
          <CardHeader title="Quick links" />
          <ul className="p-2">
            {quick.map((q) => (
              <li key={q.href}>
                <Link href={q.href} className="group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-zinc-50">
                  <q.icon className="h-4 w-4 text-primary" />
                  <span className="flex-1">{q.label}</span>
                  <ArrowRight className="h-4 w-4 text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              </li>
            ))}
            <li>
              <a href="/" target="_blank" rel="noreferrer" className="group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-zinc-50">
                <ArrowRight className="h-4 w-4 text-primary" />
                <span className="flex-1">Open the website</span>
              </a>
            </li>
          </ul>
        </Card>
      </div>
    </>
  );
}
