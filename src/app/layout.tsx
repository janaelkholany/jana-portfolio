import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jana Elkholany Portfolio",
  description: "Portfolio of Jana Mohamed Wahba Elkholany, a second-year Software Engineering student at Suez Canal University. Academic information, technical skills, and course assignments.",
  keywords: ["Jana Elkholany", "Software Engineering", "Suez Canal University", "Portfolio", "Web Design"],
  authors: [{ name: "Jana Mohamed Wahba Elkholany" }],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Jana Elkholany Portfolio",
    description: "Second-year Software Engineering student at Suez Canal University.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jana Elkholany Portfolio",
    description: "Second-year Software Engineering student at Suez Canal University.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
