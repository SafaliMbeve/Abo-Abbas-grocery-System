import React from "react";
import { Title } from "./ui/text";
import { CategoryWithProductCount } from "@/sanity/queries";
import { urlFor } from "@/sanity/lib/image";
import  Image from "next/image";
import Link from "next/link";

const HomeCategories = ({categories}: { categories: CategoryWithProductCount[]}) => {
  return (
    <div className="rounded-3xl border border-black/6 bg-white p-5 shadow-sm sm:p-7 lg:p-8">
      <Title className="border-b border-black/6 pb-4">Popular Categories</Title>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories?.map((category)=>(
          <div key={category?._id} className="group flex items-center gap-4 rounded-2xl border border-black/5 bg-shop-light-bg p-4 transition-all duration-200 hover:border-shop-dark-red/20 hover:bg-white hover:shadow-md">{category?.image && (
            <div className="size-20 shrink-0 overflow-hidden rounded-xl border border-black/5 bg-white p-2 transition-colors group-hover:border-shop-dark-red/20">
              <Link 
              href= {{pathname: '/shop', query: {category : category?.slug?.current}}}>
              <Image
                src={urlFor(category?.image).url()}
                alt="categoryImage"
                width={500}
                height={500}
                className="w-full h-full object-contain group-hover:scale-110 hoverEffect"/>
              </Link>
            </div>
            )}
            <div className="space-y-1">
              <h3 className="text-base font-semibold">{category?.title}</h3>
              <p className="text-sm">
                <span className="font-bold text-shop-dark-red">{`(${category?.productCount})`}</span>{""} Items Available
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
};

export default HomeCategories