import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://creator.papiers-express.fr"),
  title: {
    template: "%s | Papiers Express Creator",
    default: "Papiers Express Creator Program | Espace Partenaires",
  },
  description: "Plateforme officielle de gestion pour les créateurs et partenaires de Papiers Express. Suivez vos leads, vos statistiques et vos commissions en temps réel.",
  keywords: ["Papiers Express", "Creator Program", "Partenaires", "SaaS", "Dashboard", "Affiliation", "Démarches administratives"],
  authors: [{ name: "Papiers Express" }],
  creator: "Papiers Express",
  publisher: "Papiers Express",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo-icone.png",
  },
  openGraph: {
    title: "Papiers Express Creator Program",
    description: "Gérez votre activité de partenaire Papiers Express. Suivez vos leads et commissions en direct.",
    url: "https://creator.papiers-express.fr",
    siteName: "Papiers Express Creator",
    images: [
      {
        url: "/full_logo.png",
        width: 1200,
        height: 630,
        alt: "Papiers Express Creator Program",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Papiers Express Creator Program",
    description: "Plateforme de gestion pour les créateurs et partenaires de Papiers Express.",
    images: ["/full_logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              {children}
              <Toaster position="top-right" richColors />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
