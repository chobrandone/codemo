"use client";

import { Fragment, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Mail, MailOpen, Reply, Trash2 } from "lucide-react";
import { deleteMessages, setMessagesRead } from "@/app/admin/actions/messages";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { useToast } from "@/components/admin/toast";
import { cn, formatDate } from "@/lib/utils";

type M = {
  id: string;
  name: string;
  email: string;
  inquiryType: string;
  message: string;
  read: boolean;
  emailSent: boolean;
  createdAt: string;
};

export function MessageTable({ messages }: { messages: M[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const toast = useToast();
  const router = useRouter();

  const run = (p: Promise<{ ok: boolean; message?: string }>, clear = true) =>
    start(async () => {
      const r = await p;
      toast(r.message ?? "Done", r.ok);
      if (clear) setSelected([]);
      router.refresh();
    });

  const toggleOpen = (m: M) => {
    setOpen(open === m.id ? null : m.id);
    if (!m.read && open !== m.id) run(setMessagesRead([m.id], true), false);
  };

  if (!messages.length) return <p className="px-5 py-16 text-center text-sm text-zinc-500">No messages match these filters.</p>;

  const all = selected.length === messages.length;
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-100 px-4 py-2.5">
        <input
          type="checkbox"
          aria-label="Select all"
          checked={all}
          onChange={() => setSelected(all ? [] : messages.map((m) => m.id))}
          className="h-4 w-4 accent-primary"
        />
        <span className="text-xs text-zinc-500">{selected.length ? `${selected.length} selected` : "Select messages for bulk actions"}</span>
        {selected.length > 0 && (
          <span className="ml-auto flex gap-1.5">
            <Button size="sm" variant="outline" disabled={pending} onClick={() => run(setMessagesRead(selected, true))}>
              <MailOpen /> Mark read
            </Button>
            <Button size="sm" variant="outline" disabled={pending} onClick={() => run(setMessagesRead(selected, false))}>
              <Mail /> Mark unread
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 hover:bg-red-50"
              disabled={pending}
              onClick={() => confirm(`Delete ${selected.length} message(s)?`) && run(deleteMessages(selected))}
            >
              <Trash2 /> Delete
            </Button>
          </span>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="w-10 px-4 py-2" />
              <th className="px-2 py-2 font-medium">From</th>
              <th className="px-2 py-2 font-medium">Type</th>
              <th className="hidden px-2 py-2 font-medium md:table-cell">Message</th>
              <th className="px-2 py-2 font-medium">Received</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {messages.map((m) => (
              <Fragment key={m.id}>
                <tr className={cn("cursor-pointer hover:bg-zinc-50", !m.read && "bg-amber-50/40")} onClick={() => toggleOpen(m)}>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      aria-label={`Select message from ${m.name}`}
                      checked={selected.includes(m.id)}
                      onChange={() => setSelected((s) => (s.includes(m.id) ? s.filter((x) => x !== m.id) : [...s, m.id]))}
                      className="h-4 w-4 accent-primary"
                    />
                  </td>
                  <td className="px-2 py-3">
                    <p className={cn("text-zinc-900", !m.read && "font-semibold")}>
                      {!m.read && <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-gold" aria-label="Unread" />}
                      {m.name}
                    </p>
                    <p className="text-xs text-zinc-500">{m.email}</p>
                  </td>
                  <td className="px-2 py-3">
                    <Badge tone="green">{m.inquiryType}</Badge>
                  </td>
                  <td className="hidden max-w-xs truncate px-2 py-3 text-zinc-600 md:table-cell">{m.message}</td>
                  <td className="whitespace-nowrap px-2 py-3 text-xs text-zinc-500">{formatDate(m.createdAt)}</td>
                  <td className="pr-3">
                    <ChevronDown className={cn("h-4 w-4 text-zinc-400 transition", open === m.id && "rotate-180")} />
                  </td>
                </tr>
                {open === m.id && (
                  <tr className="bg-zinc-50/60">
                    <td />
                    <td colSpan={5} className="px-2 pb-5 pt-1">
                      <p className="whitespace-pre-wrap rounded-lg border border-zinc-200 bg-white p-4 leading-relaxed text-zinc-800">{m.message}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Button size="sm" asChild>
                          <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message to CODEMO")}`}>
                            <Reply /> Reply by email
                          </a>
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => run(setMessagesRead([m.id], !m.read), false)}>
                          {m.read ? <Mail /> : <MailOpen />} Mark {m.read ? "unread" : "read"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => confirm("Delete this message?") && run(deleteMessages([m.id]))}
                        >
                          <Trash2 /> Delete
                        </Button>
                        <span className="ml-auto text-xs text-zinc-400">
                          {m.emailSent ? "Email notification sent" : "Email notification not sent (check SMTP settings)"}
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
