import { AdminSidebar } from "@/components/admin/sidebar";
import { requireUser } from "@/lib/auth-guard";
import { db } from "@/lib/db";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const unread = await db.message.count({ where: { read: false } });
  return (
    <>
      <AdminSidebar user={user} unread={unread} />
      <div className="lg:pl-64">
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>
      </div>
    </>
  );
}
