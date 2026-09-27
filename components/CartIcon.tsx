"use client"
import useStore from "@/store";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import React from "react"

const CartIcon = () => {
  const itemCount = useStore((state) => state.items.reduce((count, item) => count + item.quantity, 0));
  return ( 
        <Link href={"/cart"} className="group relative">
          <ShoppingBag className="w-5 h-5 hover:text-shop-light-red hoverEffect"/>
          <span aria-label={`${itemCount} items in cart`} className="absolute -right-1 -top-1 flex size-3.5 items-center justify-center rounded-full bg-shop-orange text-xs font-semibold text-white">{itemCount}</span>
        </Link>
  );
};

export default CartIcon;