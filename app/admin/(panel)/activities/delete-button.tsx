"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteActivity } from "@/app/admin/actions/activities";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/admin/toast";

export function DeleteActivityButton({ id, title }: { id: string; title: string }) {
  const [pending, start] = useTransition();
  const toast = useToast();
  const router = useRouter();
  return (
    <Button
      type="button"
      variant="outline"
      className="text-red-600 hover:bg-red-50"
      disabled={pending}
      onClick={() => {
        if (!confirm(`Delete “${title}” and its page? This cannot be undone.`)) return;
        start(async () => {
          const r = await deleteActivity(id);
          toast(r.message ?? "", r.ok);
          if (r.ok) router.push("/admin/activities");
        });
      }}
    >
      <Trash2 /> Delete activity
    </Button>
  );
}
