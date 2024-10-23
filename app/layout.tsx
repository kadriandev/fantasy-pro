import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Link from "next/link";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>
            <main className="min-h-screen flex flex-col items-center">
              <SidebarProvider>
                <AppSidebar />
                <div className="mt-14 flex-1 w-full flex flex-col items-center">
                  <div className="w-full flex flex-col max-w-7xl p-5">
                    {children}
                  </div>
                </div>
              </SidebarProvider>
            </main>
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
