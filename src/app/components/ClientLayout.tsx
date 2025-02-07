// ClientLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const showNavbar =
    !pathname.startsWith("/noaccess") && !pathname.startsWith("/auth");

  return (
    <div className="flex flex-col min-h-full">
      {showNavbar && <Navbar />}
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
}
