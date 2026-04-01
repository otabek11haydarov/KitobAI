import type { Metadata } from "next";
import { Inter } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KitobAI - Kelajak Kutubxonasi",
  description: "AI-powered platform for readers, literary analysis, community and marketplace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" data-bs-theme="light">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
