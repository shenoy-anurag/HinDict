import type { Metadata } from "next";
import "./globals.css";
// import { Geist, Geist_Mono } from "next/font/google";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "HinDict",
  description: "An LLM powered Dictionary to learn Hindi words, their meanings, synonyms, antonyms and usage.",
  authors: [{name: "Anurag Shenoy", url: "https://anuragshenoy.in"}]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"bg-default min-h-screen"}>{children}</body>
      {/* <a href="https://www.flaticon.com/free-icons/hindi" title="hindi icons">Hindi icons created by Three musketeers - Flaticon</a> */}
    </html>
  );
}
