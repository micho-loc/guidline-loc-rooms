import type { Metadata } from "next";
import { Suspense } from "react";
import { LanguageProvider } from "@/components/language";
import "./globals.css";

export const metadata: Metadata = {
  title: "Panduan Koneksi — Laut Otsuka",
  description: "Panduan koneksi Wi-Fi dan proyektor ruang rapat Laut Otsuka.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Serif+Display&family=Noto+Sans+JP:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className="min-h-screen grid-bg">
        <Suspense fallback={null}>
          <LanguageProvider>{children}</LanguageProvider>
        </Suspense>
      </body>
    </html>
  );
}
