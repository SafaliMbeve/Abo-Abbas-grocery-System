import AddToCartButton from "@/components/AddToCartButton";
import Container from "@/components/Container";
import FavoriteButton from "@/components/FavoriteButton";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import ProductCharacteristics from "@/components/ProductCharacteristics";
import { getApprovedProductReviews, getProductBySlug } from "@/sanity/queries";
import { CornerDownLeft, StarIcon } from "lucide-react";
import React from "react";
import {RxBorderSplit} from "react-icons/rx";
import {FaRegQuestionCircle} from "react-icons/fa";
import {FiShare} from "react-icons/fi";
import {TbTruck, TbTruckDelivery} from "react-icons/tb"
import { notFound } from "next/navigation";
import dayjs from "dayjs";


const SingleProductPage = async ({params}:{params:Promise<{slug:string}>}) => {
    const {slug} = await params;
    const product = await getProductBySlug(slug);
    if (!product) notFound();
    const reviews = await getApprovedProductReviews(product._id);
    const averageRating = reviews.length
      ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
      : 0;
    

  return ( 
  <Container className="flex flex-col md:flex-row gap-10 py-10">
        {product?.images && (
            <ImageView key={product._id} images={product.images} isStock={product.stock}/>
        )}
    <div className="w-full md:w-1/2 flex flex-col gap-5">
       <div className="space-y-1">
        <h2 className="text-2xl font-bold">{product?.name}</h2>
        <p className="text-sm text-gray-600 tracking-wide">
             {product?.description}
        </p>
        <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-0.5" aria-label={reviews.length ? `${averageRating.toFixed(1)} out of 5 stars` : "No customer reviews yet"}>
            {[...Array(5)].map((_, index)=> (
                <StarIcon
                key={index}
                size={12}
                className={index < Math.round(averageRating) ? "text-shop-orange" : "text-gray-300"}
                fill={index < Math.round(averageRating) ? "#fb6c08" : "none"}/>         
             ))}
            </div>
            {reviews.length ? (
              <span className="text-gray-600">
                {averageRating.toFixed(1)} ({reviews.length}{" "}
                {reviews.length === 1 ? "review" : "reviews"})
              </span>
            ) : (
              <span className="text-gray-600">No customer reviews yet</span>
            )}
        </div>
       </div>
       <div className="space-y-2 border-t border-b border-gray-200 py-5">
        <PriceView 
        price={product?.price}
        discount={product?.discount}
        className="text-lg font-bold"/>
        <p className={`px-4 py-1.5 text-sm text-center font-semibold inline-block rounded-lg ${product?.stock === 0 ? "bg-orange-300 text-orange-700" : "text-red-700 bg-red-300"}`}>
            {(product?.stock as number) > 0 ? "In Stock" : "Out of Stock"}</p>
       </div>
       <div className="flex items-center gap-2.5 lg:gap-5">
         <AddToCartButton product={product}/>
         <FavoriteButton showProduct={true} product={product}/>
       </div>
        <ProductCharacteristics product={product}/>
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-b
        border-b-gray-200 py-5 -mt-2">
            <div className="flex items-center gap-2 text-sm text-black
            hover:text-red-600 hoverEffect">
                <RxBorderSplit className="text-lg"/>
                <p>Compare Colour</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-black
            hover:text-red-600 hoverEffect">
                <FaRegQuestionCircle className="text-lg"/>
                <p>Ask Question</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-black
            hover:text-red-600 hoverEffect">
                <TbTruckDelivery className="text-lg"/>
                <p>Delivery and Return</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-black
            hover:text-red-600 hoverEffect">
                <FiShare className="text-lg"/>
                <p>Share</p>
            </div>
        </div>
       <div className="flex flex-col">
        <div className="border border-light/25 border-b-0 p-3 flex items-center gap-2.5">
        <TbTruck size={30} className="text-shop-orange"/>
        <div>
            <p className="text-base font-semibold text-black">
                Delivery
            </p>
            <p className="text-sm text-gray-500 underline underline-offset-2">
                Enter your Postal Code for delivery availability.
            </p>
        </div>
        </div>
        <div className="border border-light/25 p-3 flex items-center gap-2.5">
        <CornerDownLeft size={30} className="text-shop-orange hoverEffect"/>
        <div>
            <p className="text-base font-semibold text-black">
                Return Order
            </p>
            <p className="text-sm text-gray-500">
                Free Delivery for orders above K500.{""}
                <span className="underline underline-offset-2">Details</span>
            </p>
        </div>
        </div>
       </div>
        <section aria-labelledby="product-reviews-title" className="border-t border-gray-200 pt-5">
          <h3 id="product-reviews-title" className="text-lg font-semibold text-dark">
            Customer reviews
          </h3>
          {reviews.length === 0 ? (
            <p className="mt-2 text-sm leading-6 text-gray-600">
              There are no approved customer reviews for this product yet.
            </p>
          ) : (
            <ul className="mt-4 space-y-4">
              {reviews.map((review) => (
                <li key={review._id} className="rounded-xl border border-gray-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-dark">{review.customerName}</p>
                    {review.submittedAt && (
                      <time dateTime={review.submittedAt} className="text-xs text-gray-500">
                        {dayjs(review.submittedAt).format("MMMM D, YYYY")}
                      </time>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-medium text-shop-orange">
                    {review.rating} out of 5 stars
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                    {review.comment}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
    </div>
  </Container>
  );
}

export default SingleProductPage;