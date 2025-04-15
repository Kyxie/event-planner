import "@/styles/globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Event Planner",
  description: "Manage your events with timeline and list view",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-gray-50 text-gray-900 flex flex-col min-h-screen"}>
        {/* Header */}
        <header className="border-b bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">📅 Event Planner</h1>
          <nav className="space-x-4">
            <Link href="/events/list" className="hover:underline">List View</Link>
            <Link href="/events/timeline" className="hover:underline">Timeline View</Link>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-grow p-6 max-w-5xl mx-auto w-full">{children}</main>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 py-6 bg-white border-t">
          Built by Kunyang © 2025
        </footer>
      </body>
    </html>
  );
}
