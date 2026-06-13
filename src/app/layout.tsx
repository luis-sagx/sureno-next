import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";

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
    <html lang="es" suppressHydrationWarning className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Hanken+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
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
