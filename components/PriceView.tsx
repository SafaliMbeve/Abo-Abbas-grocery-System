import React from "react"
import PriceFormatter from "./PriceFormatter";
import { cn } from "@/lib/utils";

interface Props {
    price: number | undefined;
    discount: number | undefined;
    className?: string; 
}

const PriceView = ({ price, discount, className}: Props) => {
  return (

        <div className={cn("flex items-center gap-2 px-4", className)}>
            <PriceFormatter amount={price} className="font-semibold text-shop-dark-red"/>
            {price && discount && (<PriceFormatter amount={price + (discount * price) / 100 }
            className="line-through text-sm font-normal text-shop_light_text" />
            )}
        </div>
  )
}

export default PriceView