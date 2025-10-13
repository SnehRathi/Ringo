import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "../redux/Providers";
import AuthProvider from "../components/providers/AuthProvider";

// Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// App metadata
export const metadata: Metadata = {
  title: "Ringo - Chat App",
  description: "A real-time chat application built with Next.js, Redux, and Socket.IO",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" }, // default
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }, // optional
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" }, // optional
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }], // optional
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Wrap app in Redux first, then AuthProvider */}
        <ReduxProvider>
          <AuthProvider>{children}</AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
