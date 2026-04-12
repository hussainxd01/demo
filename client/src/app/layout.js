import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import SearchModal from "@/components/layout/SearchModal";
import Cart from "@/components/layout/Cart";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import Toast from "@/components/common/Toast";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "Charmsvilla | Luxury Beauty Store",
    template: "%s | Charmsvilla",
  },
  description: "Premium curated beauty, skincare, and luxury cosmetic products.",
  openGraph: {
    title: "Charmsvilla | Luxury Beauty Store",
    description: "Premium curated beauty, skincare, and luxury cosmetic products.",
    siteName: "Charmsvilla",
    images: [
      {
        url: "/main.jpg",
        width: 1200,
        height: 630,
        alt: "Charmsvilla Product Showcase",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-white">
        {/* <ErrorBoundary> */}
        <AuthProvider>
          <ShopProvider>
            <Header />
            <Navigation />
            <SearchModal />
            <Cart />
            <main>{children}</main>
            <Toast />
          </ShopProvider>
        </AuthProvider>
        {/* </ErrorBoundary> */}
      </body>
    </html>
  );
}
