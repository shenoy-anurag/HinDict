import type { Metadata } from "next";
import "./globals.css";
import AnalyticsWrapper from "@/component/analytics.component";

export const metadata: Metadata = {
  title: "HinDict",
  description: "An LLM powered Dictionary to learn Hindi words, their meanings, synonyms, antonyms and usage.",
  authors: [{ name: "Anurag Shenoy", url: "https://anuragshenoy.in" }]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"bg-default min-h-screen"}>
        {children}
        <AnalyticsWrapper />
      </body>
    </html>
  );
}
