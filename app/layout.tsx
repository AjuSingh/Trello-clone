import type { Metadata } from "next";
import "./globals.css";
import Modal from "@/components/Modal";
import Login from "@/components/Login";


export const metadata: Metadata = {
  title: "Trello Clone",
  description: "Clone by Ajvinder Singh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#F5F6F8]">{children}</body>
      <Modal />
      <Login/>
    </html>
  );
}
