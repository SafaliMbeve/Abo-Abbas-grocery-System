"use client"

import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import React, { useState } from "react";

type ProductImage = NonNullable<Product["images"]>[number];

interface Props{
    images?: Product["images"];
    isStock?: number | undefined;
}

const ImageView = ({images=[], isStock}:Props) => {
    const [active, setActive] = useState<ProductImage | undefined>(images[0]);
    
  return (
    <div className="w-full md:w-1/2 space-y-2 md:space-y-4">
        <AnimatePresence mode="wait">
            {active && <motion.div key={active._key}
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            transition={{duration: 0.5}}
            className="group relative h-[min(78vw,550px)] min-h-[300px] w-full overflow-hidden rounded-2xl border border-black/10 bg-shop-light-bg md:min-h-[400px]">
                <Image 
                src={urlFor(active).url()}
                alt= "productImage"
                width={700}
                height= {700}
                priority
                className={`h-full w-full rounded-2xl object-contain p-5 transition-transform duration-300 group-hover:scale-[1.03]
                ${isStock === 0 ? "opacity-50" : ""}`}/>
            </motion.div>}
        </AnimatePresence>
        <div className="grid grid-cols-6 gap-2 h-20 md:h-24">
            {images?.map((image)=>(
                <button key={image?._key} onClick={()=> setActive(image)}
                     aria-label={`View product image ${image?._key}`}
                     aria-pressed={active?._key === image?._key}
                     className={`overflow-hidden rounded-xl border bg-white p-1 transition-colors ${active?._key === image?._key ? "border-shop-dark-red opacity-100" : "border-black/10 opacity-80 hover:opacity-100"}`}> 
                   <Image 
                      src={urlFor(image).url()}
                      alt={`Thumbnail ${image?._key}`}
                      width={100}
                      height={100}
                      className="h-full w-full object-contain"
                    />
                </button>
            ))}
        </div>
    </div>
  )
}

export default ImageView