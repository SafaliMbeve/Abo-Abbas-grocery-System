"use client"

import { useEffect, useState } from "react";
import HomeTabBar from "./HomeTabBar";
import { productType } from "@/constants/data";
import { client } from "@/sanity/lib/client";
import {AnimatePresence, motion} from "motion/react";
import { Loader2 } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";
import { Product } from "@/sanity.types";

const query = `*[_type == "product" && variant == $variant] | order(name desc) {..., "categories": categories[]->title}`;

const ProductGrid = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState(productType[0]?.title || "");

    useEffect(() => {
        const fetchData = async () =>{
            setLoading(true);
            try{
                const selectedProductType = productType.find((item) => item.title === selectedTab);
                const params = { variant: selectedProductType?.value ?? selectedTab.toLowerCase() } as Record<string, string>;
                const response = await client.fetch<Product[]>(query, params);
                setProducts(response);
            } catch (error) {
                console.error("Product Fetching Error:",error);
            } finally {
                setLoading(false);
            }  
        };
        fetchData();
    }, [selectedTab]);

  return ( <div>
              <HomeTabBar selectedTab={selectedTab} onTabSelect={setSelectedTab}/>
              {loading ? (<div className="flex flex-col items-center justify-center py-10
              min-h-80 gap-4 rounded-2xl border border-black/[0.05] bg-shop-light-bg w-full mt-8">
                <div className="flex items-center gap-2 text-shop-dark-red">
                    <Loader2 className="size-5 animate-spin"/>
                    <span>Product is loading...</span>
                </div>
              </div>)
               :products?.length ? (
               <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
               {products?.map((product)=>(
                <AnimatePresence key={product?._id}>
                    <motion.div layout initial={{opacity:0.2}} animate={{opacity:1}} exit={{opacity: 0}}>
                        <ProductCard product={product}/>
                    </motion.div>
                </AnimatePresence>
               ))}
               </div>):(<NoProductAvailable selectedTab={selectedTab}/>)}
        </div>
  );
};

export default ProductGrid;