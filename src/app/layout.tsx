import type { Metadata } from "next";
import { Providers } from "./providers";
import { Poppins } from "next/font/google";
import MainLayout from "@/components/Layouts/Main";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { getServerUser } from "@/app/api/auth/actions";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getServerUser();

  return (
    <html lang="pt-br" className={poppins.variable} suppressHydrationWarning>
      <body style={{ height: "100dvh" }} suppressHydrationWarning>
        <AppRouterCacheProvider options={{ key: "css" }}>
          <Providers initialUser={user}>
            <MainLayout>
              {children}
            </MainLayout>
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
