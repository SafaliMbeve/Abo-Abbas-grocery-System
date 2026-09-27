import React from "react";
import Image from "next/image";
import { Title } from "./ui/text";
import Link from "next/link";
import { getAllBrands } from "@/sanity/queries";
import { urlFor } from "@/sanity/lib/image";
import { GitCompareArrows, Headset, ShieldCheck, Truck } from "lucide-react";

const extraData = [
    {
        title: "Free Delivery",
        description: "Free shipping over K500",
        icons: <Truck size={45}/>
    },

    {
        title: "Free Return",
        description: "Free Return on ordered products",
        icons: <GitCompareArrows size={45}/>
    },

    {
        title: "Customer Support",
        description: "Friendly Customer Support",
        icons: <Headset size={45}/>
    },

    {
        title: "Money Back Guarantee",
        description: "Quality checked by our employees",
        icons: <ShieldCheck size={45}/>
    }
]

const ShopByBrands = async() => {
    const brands = await getAllBrands();
  return (
  <div className="rounded-3xl border border-black/5 bg-shop-light-bg p-5 sm:p-7 lg:p-8">
        <div className="flex items-center gap-5 justify-between mb-10">
           <Title className="text-2xl">Shop By Brands</Title>
           <Link href={"/shop"}
           className="text-sm font-semibold tracking-wide text-shop-dark-red transition-colors hover:text-shop-light-red"> View All</Link>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {(Array.isArray(brands) ? brands : []).map((brand: { _id?: string; slug?: { current?: string }; image?: Parameters<typeof urlFor>[0] }) => (
                <Link 
                 key={brand?._id}
                 href= {{pathname: '/shop', query: {brand: brand?.slug?.current}}}
                 className="flex h-24 items-center justify-center overflow-hidden rounded-xl border border-black/5 bg-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-shop-dark-red/20 hover:shadow-lg hover:shadow-shop-dark-red/6">
                    {brand?.image &&(
                        <Image
                        src={urlFor(brand?.image).url()}
                        alt="brandImage"
                        width={250}
                        height={250}
                        className="h-20 w-full object-contain"
                        />
                    )}
                </Link>
            ))}
         </div>
         <div className="mt-10 grid grid-cols-1 gap-4 border-t border-black/6 pt-7 sm:grid-cols-2 lg:grid-cols-4">
         {extraData?.map((item,index) =>(
            <div key={index} className="flex items-center gap-3 group
             rounded-xl p-2 text-light transition-colors hover:text-shop-dark-red">
                <span className="inline-flex scale-100 group-hover:scale-90 hoverEffect">
                    {item?.icons}
                </span>
                <div className="text-sm">
                    <p className="text-dark/80 font-bold capitalize">
                     {item?.title}
                    </p>
                    <p className="text-light">{item?.description}</p>
                </div>
            </div>
         ))}

         </div>
  </div>
  );
}

export default ShopByBrands