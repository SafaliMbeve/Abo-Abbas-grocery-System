import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {ClerkProvider} from "@clerk/nextjs"


export const metadata: Metadata = {
  title: "Abo Abbas",
  description: "Abo Abbas is a grocery store that offers a wide range of fresh produce, meats, and other food items. We are committed to providing our customers with the highest quality products at competitive prices",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
  <ClerkProvider>
      <div className="flex flex-col min-h-screen">
      <Header/>
      <main className="flex-1" >{children}</main>
      <Footer/>
      </div>
  </ClerkProvider> 
  );
}
