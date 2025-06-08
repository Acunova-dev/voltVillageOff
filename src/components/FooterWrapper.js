"use client";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper() {  const pathname = usePathname();
  if (pathname.startsWith("/messages") || pathname.startsWith("/Signup")) return null;
  return <Footer />;
} 