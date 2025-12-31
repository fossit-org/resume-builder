import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resume Builder - Create Professional Resumes with AI",
  description: "Build beautiful, professional resumes with AI-powered recommendations. Support for ChatGPT, Gemini, Claude, and Perplexity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 font-sans">
        {children}
      </body>
    </html>
  );
}
