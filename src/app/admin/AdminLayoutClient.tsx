"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen -mt-14 pt-14">
      <AdminSidebar />
      <div className="flex-1 bg-gray-50 p-8 overflow-auto">
        {children}
      </div>
    </div>
  );
}
