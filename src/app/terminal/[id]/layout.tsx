"use client";

import NoSidebarLayout from "@/components/Layouts/NoSidebar/component";
import React from "react";

interface TerminalLayoutProps {
  children: React.ReactNode;
}

export default function TerminalLayout({ children }: TerminalLayoutProps) {
  return (
    <NoSidebarLayout >
      {children}
    </NoSidebarLayout>
  );
}
