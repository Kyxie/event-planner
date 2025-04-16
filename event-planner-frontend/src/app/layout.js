import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Event Planner',
  description: 'Manage your events with timeline and list view',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className + ' flex min-h-screen flex-col bg-gray-50 text-gray-900'}>
        {/* Header */}
        <header className="flex items-center justify-between border-b bg-white p-4 shadow-sm">
          <h1 className="text-xl font-semibold">📅 Event Planner</h1>
        </header>

        {/* Main Content */}
        <main className="mx-auto w-full max-w-5xl flex-grow p-6">{children}</main>
        <Toaster position="top-right" richColors />

        {/* Footer */}
        <footer className="border-t bg-white py-6 text-center text-sm text-gray-500">
          Built by Kunyang © 2025
        </footer>
      </body>
    </html>
  );
}
