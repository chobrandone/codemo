import type { Metadata } from "next";
import { ToastProvider } from "@/components/admin/toast";

export const metadata: Metadata = {
  title: { default: "CODEMO Admin", template: "%s · CODEMO Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <ToastProvider>{children}</ToastProvider>
    </div>
  );
}
