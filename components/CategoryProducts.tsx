"use client";

import { Category, Product } from "@/sanity.types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { client } from "@/sanity/lib/client";
import { AnimatePresence, motion } from "motion/react";
import { Loader } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";

interface Props {
  categories: Category[];
  slug: string;
}

const CategoryProducts = ({ categories, slug }: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      await Promise.resolve();
      if (cancelled) return;
      setLoading(true);

      try {
        const query = `*[_type == "product" && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(name asc){ ..., "categories": categories[]->title}`;
        const data = await client.fetch<Product[]>(query, { categorySlug: slug });
        if (!cancelled) setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <div className="flex flex-col items-start gap-5 py-5 md:flex-row">
      <div className="flex flex-col border md:min-w-40">
        {categories.map((item) => (
          <Button
            onClick={() => item.slug?.current && router.push(`/category/${item.slug.current}`, { scroll: false })}
            key={item._id}
            className={`rounded-none border-0 border-b p-0 text-dark shadow-none last:border-b-0 hover:bg-shop-orange hover:text-white ${
              item.slug?.current === slug ? "bg-shop-orange text-white" : "bg-transparent"
            }`}
          >
            <span className="w-full px-2 text-left capitalize">{item.title}</span>
          </Button>
        ))}
      </div>
      <div className="flex-1">
        {loading ? (
          <div className="flex min-h-80 w-full flex-col items-center justify-center gap-4 rounded-lg bg-gray-100 py-10 text-center">
            <div className="flex items-center gap-2 text-shop-dark-red">
              <Loader className="size-5 animate-spin" />
              <span>Product is loading...</span>
            </div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-5">
            {products.map((product) => (
              <AnimatePresence key={product._id}>
                <motion.div>
                  <ProductCard product={product} />
                </motion.div>
              </AnimatePresence>
            ))}
          </div>
        ) : (
          <NoProductAvailable selectedTab={slug} className="mt-0 w-full" />
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
