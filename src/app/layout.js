import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from './context/AuthContext';
import TopLoadingBar from "@/components/TopLoadingBar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "VoltVillage",
  description: "Your trusted marketplace for university engineering components",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <TopLoadingBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
