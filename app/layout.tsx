import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { SiteProvider } from "@/context/SiteContext";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "COMPANY LOGO — 프리미엄 비즈니스 매칭 플랫폼",
  description: "엄선된 회원 전용 프리미엄 비즈니스 매칭 네트워크",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`h-full antialiased ${notoSansKR.variable}`}>
      <body
        className="min-h-full flex flex-col"
        style={{ background: "#0A0A0A", color: "#F5F0E8", fontFamily: "var(--font-noto), 'Noto Sans KR', sans-serif" }}
      >
        <SiteProvider><AuthProvider>{children}</AuthProvider></SiteProvider>
      </body>
    </html>
  );
}
