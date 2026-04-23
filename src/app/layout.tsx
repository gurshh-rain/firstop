import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from 'next/font/google'

export const metadata: Metadata = {
  title: "FirstOpz — Internships for Students",
  description: "FirstOpz connects students with real internship and startup opportunities.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}