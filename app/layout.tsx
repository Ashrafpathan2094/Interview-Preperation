import type { Metadata } from "next";
import { Montserrat, Nunito, JetBrains_Mono } from "next/font/google";
import { topics } from "@/lib/topics";
import AppShell from "@/components/AppShell";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Interview Prep — 3+ Years",
  description:
    "Most-asked interview questions for React, Next.js, Angular, Node.js, NestJS, Express, MongoDB, SQL, JavaScript, TypeScript & DSA, with detailed answers and code.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nav = topics.map((t) => ({
    slug: t.slug,
    name: t.name,
    count: t.sections.reduce((n, s) => n + s.questions.length, 0),
  }));

  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${nunito.variable} ${jetbrainsMono.variable}`}
      >
        <AppShell nav={nav}>{children}</AppShell>
      </body>
    </html>
  );
}
