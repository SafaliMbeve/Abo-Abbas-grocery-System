import React from "react"
import Link from 'next/link'
import { productType } from "@/constants/data";

interface Props {
    selectedTab: string;
    onTabSelect: (tab: string) => void;
}

const HomeTabBar = ({selectedTab, onTabSelect}:Props) => {
  return ( 
  <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
    <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
        {productType?.map((item)=>(
            <button 
            onClick={()=>onTabSelect(item?.title)}
            key={item?.title}
            aria-pressed={selectedTab === item?.title}
            className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 sm:text-sm ${
                selectedTab === item?.title
                  ? "border-shop-dark-red bg-shop-dark-red text-white shadow-sm shadow-shop-dark-red/15"
                  : "border-black/10 bg-white text-shop_light_text hover:border-shop-dark-red/30 hover:bg-shop-light-bg hover:text-shop-dark-red"
            }`}>{item?.title}</button>
        ))}
    </div>
    <Link href={"/shop"} className="inline-flex items-center gap-1 text-sm font-semibold text-shop-dark-red transition-colors hover:text-shop-light-red">See all products <span aria-hidden="true">→</span></Link>
  </div>
  );
}

export default HomeTabBar