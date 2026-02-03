"use client";

import NoSidebarLayout from "@/components/Layouts/NoSidebar/";

export default function LiveTerminalLayout({ children }: { children: React.ReactNode }) {
  return (
    <NoSidebarLayout >
      {children}
    </NoSidebarLayout>
  );
}
