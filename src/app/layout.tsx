import type { Metadata } from 'next';

import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';

import { AuthProvider } from '@/components/providers/AuthProvider';

export const metadata: Metadata = {
  title: 'KitobAI - Kelajak Kutubxonasi',
  description: 'AI-powered platform for readers, literary analysis, community and marketplace.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" data-bs-theme="light" suppressHydrationWarning>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
