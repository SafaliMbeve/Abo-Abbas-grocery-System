"use client"
import { Brand, Category, Product } from "@/sanity.types";
import React, { useEffect, useState } from "react";
import Container from "./Container";
import CategoryList from "./shop/CategoryList";
import BrandList from "./shop/BrandList";
import { useSearchParams } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { Loader2 } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";

interface Props {
  categories: Category[];
  brands: Brand[];
}

const Shop = ({ categories, brands }: Props) => {
    const searchParams = useSearchParams();
    const brandParams = searchParams?.get("brand");
    const categoryParams = searchParams?.get("category");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParams || null);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(brandParams || null);
    useEffect(()=>{
      let cancelled = false;
      const fetchProducts = async () => {
        await Promise.resolve();
        if (cancelled) return;
        setLoading(true);
        try {
          const query = `*[_type == "product" &&
            (!defined($selectedCategory) || references(*[_type == "category" && slug.current == $selectedCategory]._id)) &&
            (!defined($selectedBrand) || brand->slug.current == $selectedBrand)
          ] | order(name asc) {
            ...,
            "categories": categories[]->title
          }`;
          const data = await client.fetch<Product[]>(query, {selectedCategory, selectedBrand}, {next: {revalidate: 0}});
          if (!cancelled) setProducts(data);
        } catch (error) {
          console.error("Shop product fetching error:", error);
          if (!cancelled) setProducts([]);
        } finally {
          if (!cancelled) setLoading(false);
        }
      };

      void fetchProducts();
      return () => {
        cancelled = true;
      };
    }, [selectedCategory, selectedBrand]);

  return (
    <div className="border-t">
        <Container className="mt-5">
            <div className="sticky top-0 z-10 mb-5">
                <div className="flex items-center justify-between">
                    <div className="text-lg tracking-wide uppercase font-semibold"
                    >Shop for the products you need</div>

                    {(selectedCategory !== null ||
                      selectedBrand !== null) && (
                      <button onClick={() => {
                        setSelectedCategory(null);
                        setSelectedBrand(null);
                      }} className="text-shop-dark-red underline text-sm
                     mt-2 font-medium hover:text-shop-orange hoverEffect">
                        Reset Filters
                      </button>
                    )}
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-5 
            border-t border-t-shop-dark-red">
                <div className="md:sticky md:top-20 md:self-start
                    md:h-[calc(100vh-160px)] md:overflow-y-auto md:min-w-64
                     pb-5 md:border-r border-r-shop-dark-red/50">
                        <CategoryList
                        categories={categories}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}/>
                        <BrandList
                        brands={brands}
                        selectedBrand={selectedBrand}
                        setSelectedBrand={setSelectedBrand}/>
                 </div>
                <div className=" flex-1 pt-5">
                  <div className="h-[calc(100vh-160px)] overflow-y-auto pr-2">
                    {loading ? (<div className="p-20 flex flex-col gap-2 items-center
                    justify-center bg-white"><Loader2 className="w-10 h-10 text-shop-dark-red
                    animate-spin"/><p className="font-semibold tracking-wide text-base">
                      Product is loading...</p>
                      </div> ) :
                        products?.length > 0 ? 
                        (<div className="grid grid-cols-2
                          md:grid-cols-3 lg:grid-cols-4 gap-2.5">{products?.map((product)=>(<ProductCard key={product?._id} 
                        product={product}/>))}
                        </div>): 
                        ( <NoProductAvailable className="bg-white mt-0"/>

                         )} 
                  </div>
                </div>
            </div>
        </Container>
    </div>
  );
};

export default Shop