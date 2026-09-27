"use client"

import React from "react"
import { Product } from "@/sanity.types"
import { ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import useStore from "@/store";
import toast from "react-hot-toast";
import PriceFormatter from "./PriceFormatter";
import QuantityButtons from "./QuantityButtons";

interface Props {
    product: Product;
    className?: string;
    size?: "default" | "sm";
}

const AddToCartButton = ({ product, className, size = "default" }: Props) => {
    const {addItem, getItemCount} = useStore();
    const itemCount=getItemCount(product?._id);
    const isOutOfStock = product?.stock === 0;


    const handleAddToCart=()=>{
        if((product?.stock as number)>itemCount){
            addItem(product);
            toast.success(`${product?.name?.substring(0,12)}... added successfully!`);
        } else {
            toast.error("Out of stock!")
        }
    };

  return <div className="w-full h-12 flex items-center">
  {itemCount ? (
    <div className="text-sm w-full">
        <div className="text-sm w-full">
            <span className="text-xs text-dark/80">Quantity</span>
            <QuantityButtons product={product}/>
        </div>
        <div className="flex items-center justify-between border-t pt-1">
            <span className="text-xs font-semibold">Subtotal</span>
            <PriceFormatter amount={product?.price ? product?.price * itemCount : 0}/>
        </div>
    </div>
  ) : (
  <Button onClick={handleAddToCart}
     disabled={isOutOfStock} 
     size={size} 
     className={cn("w-full border border-shop-dark-red bg-shop-dark-red font-semibold tracking-wide text-white shadow-sm transition-all hover:border-shop-dark-red/90 hover:bg-shop-dark-red/90 hover:shadow-md", className)}>
        <ShoppingBag/> {isOutOfStock ? "Out of Stock" : "Add to Cart"}
    </Button>)}
  </div>
  
}

export default AddToCartButton;