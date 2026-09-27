import { defineQuery } from "next-sanity";

const BRANDS_QUERY = defineQuery(`*[_type == 'brand'] | order(name asc)`);

const LATEST_BLOG_QUERY = defineQuery(`*[_type == 'blog' && isLatest == true] | order(name asc){
    ...,
    blogcategories[]->{
        title
    }
}`);

const ALL_BLOGS_QUERY = defineQuery(`*[_type == "blog"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    mainImage,
    "authorName": author->name,
    "categories": blogcategories[]->title
}`);

const BLOG_BY_SLUG_QUERY = defineQuery(`*[_type == "blog" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    mainImage,
    "authorName": author->name,
    "categories": blogcategories[]->title,
    body[] {
        ...,
        _type == "image" => {
            ...,
            "imageUrl": asset->url
        }
    }
}`);

const PRODUCT_REVIEWS_QUERY = defineQuery(`*[
    _type == "review" &&
    product._ref == $productId &&
    status == "approved" &&
    isSample != true
] | order(submittedAt desc) {
    _id,
    customerName,
    rating,
    comment,
    submittedAt
}`);

const DISCOUNTS_PRODUCTS = defineQuery(`*[_type == 'product' && status == 'hot' ] | order(name asc){...,"categories": categories[]->title}`);

const PRODUCT_BY_SLUG_QUERY = defineQuery(
    `*[_type == "product" && slug.current == $slug] | order(name asc) [0]`
);

const BRAND_QUERY = defineQuery(`*[_type == "brand" && slug.current == $slug][0]{
    ...,
    "products": *[_type == "product" && references(^._id)] | order(name asc) {
        ...
    }
}`);

export {
    ALL_BLOGS_QUERY,
    BLOG_BY_SLUG_QUERY,
    PRODUCT_REVIEWS_QUERY,
    BRANDS_QUERY,
    LATEST_BLOG_QUERY,
    DISCOUNTS_PRODUCTS,
    PRODUCT_BY_SLUG_QUERY,
    BRAND_QUERY,
};