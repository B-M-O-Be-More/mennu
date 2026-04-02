import type { Metadata } from "next";
import { Providers } from "./providers";
import { Poppins } from "next/font/google";
import MainLayout from "@/components/Layouts/Main";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mennu - Gestão de Restaurantes",
  description: "Sistema completo para gestão de restaurantes, controle de estoque e movimentações.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <body style={{ height: "100dvh" }} suppressHydrationWarning>
        <AppRouterCacheProvider>
          <Providers>
            <MainLayout>
              {children}
            </MainLayout>
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
