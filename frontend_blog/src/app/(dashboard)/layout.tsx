import Menu from "@/app/components/ui/menu";
import Navbar from "@/app/components/ui/navbar";
import { Metadata } from "next";
import Link from "next/link";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Book Admin",
  description: "Next.js Book Admin System",
};


export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <h1 className="text-2xl font-bold text-blue-600">
          4TL<span className="text-gray-900">BLOG</span>
        </h1>
        </Link>
        <Menu />
      </div>
      {/* RIGHT */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
