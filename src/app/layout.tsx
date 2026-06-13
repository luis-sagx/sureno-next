import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { EB_Garamond, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const garamond = EB_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  variable: "--font-garamond",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Licorería Sureño — Distribución Premium de Licores",
    template: "%s | Licorería Sureño",
  },
  description:
    "Distribución mayorista y retail de vinos, ron, vodka y destilados premium. Socio confiable para el sector HORECA y clientes exigentes.",
  keywords: ["licorería", "destilados", "vinos", "mayorista", "HORECA", "Sureño"],
  authors: [{ name: "Licorería Sureño" }],
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "Licorería Sureño",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={`h-full ${garamond.variable} ${hanken.variable}`}>
      <body className="min-h-full flex flex-col bg-background text-on-surface font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
