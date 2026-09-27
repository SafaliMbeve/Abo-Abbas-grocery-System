import { Brand } from "@/sanity.types";
import React from "react"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

interface Props {
    brands: Brand[];
    selectedBrand?: string | null;
    setSelectedBrand: React.Dispatch<React.SetStateAction<string | null>>;
}

const BrandList = ({brands, selectedBrand, setSelectedBrand} : Props) => {
  return ( <div className="w-full bg-white p-5">
        <div className="text-base font-black">Brands</div>
        <RadioGroup value={selectedBrand || ""} className="mt-2 space-y-1">
            {brands?.map((brands)=>
            <div
            onClick={() => {setSelectedBrand(brands?.slug?.current as string);}}
            key={brands?._id} className="flex items-center space-x-2 hover:cursor-pointer">
                <RadioGroupItem value={brands?.slug?.current as string} 
                id={brands?.slug?.current} className="rounded-sm"/>
                <Label htmlFor={brands?.slug?.current}
                className={`${selectedBrand === brands?.slug?.current ? 
                    "font-semibold text-shop-dark-red" : "font-normal"}`}>{brands?.title}
                </Label>
            </div>)}
            {selectedBrand && (
                <button
                onClick={() => setSelectedBrand(null)}
                className="text-sm font-medium mt-2 underline underline-offset-2
                decoration-1 underline-offset-2 hover:text-shop-dark-red hoverEffect text-left">Reset selection</button>
            )}
        </RadioGroup>
    </div>
  )
}

export default BrandList