import type { Metadata } from "next";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { topics } from "@/lib/topics";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Interview Prep — 3+ Years",
  description:
    "Most-asked interview questions for React, Angular, Node.js, MongoDB, SQL, Express, JavaScript, TypeScript & DSA, with detailed answers and code.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={montserrat.variable}>
        <div className="app-shell">
          <aside className="sidebar">
            <Link href="/" className="brand">
              Prep<span>Hub</span>
            </Link>
            <nav className="side-nav" aria-label="Topics">
              {topics.map((t) => (
                <Link key={t.slug} href={`/${t.slug}`}>
                  {t.name}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  );
}
