import { Product } from "@/sanity.types";
import { getBrandById } from "@/sanity/queries";
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

const ProductCharacteristics = async ({ product }: { product: Product | null | undefined }) => {
  const brand = product?.brand?._ref ? await getBrandById(product.brand._ref) : null;

  return (
    <Accordion>
      <AccordionItem value="item-1">
        <AccordionTrigger>{product?.name}: Characteristics</AccordionTrigger>
        <AccordionContent>
          <p className="flex items-center justify-between">
            Brand:
            <span className="font-semibold tracking-wide">{brand?.title ?? "N/A"}</span>
          </p>
          <p className="flex items-center justify-between">
            Collection:{" "}
            <span className="font-semibold tracking-wide">2026</span>
          </p>
          <p className="flex items-center justify-between">
            Type:{" "}
            <span className="font-semibold tracking-wide">{product?.variant ?? "N/A"}</span>
          </p>
          <p className="flex items-center justify-between">
            Stock:{" "}
            <span className="font-semibold tracking-wide">{product?.stock ? "Available" : "Out of Stock"}</span>
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ProductCharacteristics;