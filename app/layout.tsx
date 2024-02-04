import type { Metadata } from "next";
import "./globals.css";
import Modal from "@/components/Modal";
import Login from "@/components/Login";
import { Toaster } from "react-hot-toast";


export const metadata: Metadata = {
  title: "Trello 2.0",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#F5F6F8]">
      <Toaster position="top-center" />
        {children}
        </body>
      <Modal />
      <Login/>
    </html>
  );
}
