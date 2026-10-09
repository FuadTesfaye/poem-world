import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Art-Nature — a place where poetry meets beauty",
  description: "A sanctuary of verse, where classical poetry meets the quiet of landscape.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=IM+Fell+English:ital@0;1&family=IM+Fell+English+SC&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="fell text-[clamp(.9rem,1.2vw,1.3rem)] leading-relaxed">
        {children}
      </body>
    </html>
  );
}
