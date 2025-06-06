import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from './context/AuthContext';
import TopLoadingBar from "@/components/TopLoadingBar";
import Footer from "@/components/Footer";
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

export default function RootLayout({ children }) {  return (
    <html lang="en"><head><link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    /><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" /></head><body className={`${geistSans.variable} ${geistMono.variable} flex-layout`}><AuthProvider><TopLoadingBar /><div className="main-content">{children}</div><Footer /></AuthProvider></body></html>
  );
}
