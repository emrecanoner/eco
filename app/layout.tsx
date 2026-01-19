import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RouteTransition } from "@/components/providers/RouteTransition";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { getSettings } from "@/lib/notion/settings";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  
  return {
    title: settings?.title || "Portfolio",
    description: settings?.description || "Personal portfolio website",
    icons: settings?.favicon ? {
      icon: settings.favicon,
      shortcut: settings.favicon,
      apple: settings.favicon,
    } : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} min-h-screen bg-white dark:bg-zinc-950 font-sans antialiased text-zinc-900 dark:text-zinc-100`}
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        <ThemeProvider>
          <RouteTransition>
            <ConditionalLayout>{children}</ConditionalLayout>
          </RouteTransition>
        </ThemeProvider>
      </body>
    </html>
  );
}
