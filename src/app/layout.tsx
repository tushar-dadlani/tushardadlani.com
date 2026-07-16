import type { Metadata } from "next";
import { Inter, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: '--font-display',
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tushardadlani.com"),
  title: "Tushar Dadlani — Fractional CTO & Product Leadership",
  description:
    "Fractional CTO and product leadership for companies building with AI. Founder, 6 US patents, platforms scaled to 3,000+ stores, hands-on with AI coding agents.",
  openGraph: {
    title: "Tushar Dadlani — Fractional CTO & Product Leadership",
    description:
      "Fractional CTO and product leadership for companies building with AI.",
    type: "website",
    url: "https://tushardadlani.com",
  },
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${plexMono.variable} scroll-smooth`}>{/* No whitespace inside html tag */}
      <head>
        <meta name="google-adsense-account" content="ca-pub-9482504628791077" />
      </head>
      <body className="antialiased">{/* No whitespace inside body tag */}
        {children}
        <Analytics />
      </body>
    </html>
  );
}
