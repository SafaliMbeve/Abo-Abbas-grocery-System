"use client";
import React from "react"
import { headerData } from '@/constants/data';
import  Link from "next/link";
import { usePathname } from "next/navigation";

const HeaderMenu = () => {
    const pathname = usePathname();
  return <nav aria-label="Main navigation" className="hidden md:inline-flex w-1/3 items-center justify-center gap-7 text-sm font-semibold text-light">{headerData?.map((item)=>(
    <Link key={item?.title} href={item?.href} aria-current={pathname === item?.href ? "page" : undefined} className={`group relative py-2 transition-colors hover:text-shop-dark-red ${pathname === item?.href ? "text-shop-dark-red" : ""}`}>
    {item?.title}
    <span className={`absolute inset-x-0 -bottom-px h-0.5 origin-left rounded-full bg-shop-dark-red transition-transform duration-200 ${pathname === item?.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}/>
    </Link>
  
  ))}
  </nav>;
  
};

export default HeaderMenu;