import type { Metadata } from "next";
import { Providers } from "./providers";
import { Poppins } from "next/font/google";
import MainLayout from "@/components/Layouts/Main";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { getServerUser, getServerActiveUnidadeId } from "@/app/api/auth/actions";

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
  const [user, activeUnidadeId] = await Promise.all([
    getServerUser(),
    getServerActiveUnidadeId(),
  ]);

  return (
    <html lang="pt-br" className={poppins.variable} suppressHydrationWarning>
      <body style={{ height: "100dvh" }} suppressHydrationWarning>
        <AppRouterCacheProvider options={{ key: "css" }}>
          <Providers initialUser={user} initialUnidadeId={activeUnidadeId}>
            <MainLayout>
              {children}
            </MainLayout>
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
