"use client";

import { Box } from "@mui/material";
import React from "react";

export default function NoSidebarLayout({ children, }: { children: React.ReactNode; }) {
  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        overflowY: "auto",
        backgroundColor: (theme) => theme.palette.background.default,
        "&::-webkit-scrollbar": {
          width: 0,
          height: 0,
        },
        scrollbarWidth: "none",
      }}
    >
      {children}
    </Box>
  );
}
