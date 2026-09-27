import { sanityFetch } from "../lib/live";
import { Brand, Category, Product } from "@/sanity.types";
import {
  ALL_BLOGS_QUERY,
  BLOG_BY_SLUG_QUERY,
  BRAND_QUERY,
  BRANDS_QUERY,
  DISCOUNTS_PRODUCTS,
  LATEST_BLOG_QUERY,
  PRODUCT_REVIEWS_QUERY,
  PRODUCT_BY_SLUG_QUERY,
} from "./query";
import { defineQuery, stegaClean } from "next-sanity";

type LatestBlogEntry = Omit<import("@/sanity.types").Blog, "blogcategories"> & {
  blogcategories?: Array<{ title?: string } | null>;
};

export type BlogListEntry = {
  _id: string;
  title?: string;
  slug?: import("@/sanity.types").Slug;
  publishedAt?: string;
  mainImage?: import("@/sanity.types").Blog["mainImage"];
  authorName?: string;
  categories?: Array<string | null>;
};

export type BlogArticle = BlogListEntry & {
  body?: Array<{
    _key: string;
    _type: string;
    _raw?: unknown;
    children?: Array<{
      _key: string;
      _type: string;
      text?: string;
      marks?: string[];
    }>;
    style?: string;
    listItem?: string;
    markDefs?: Array<{
      _key: string;
      _type: string;
      href?: string;
      " href"?: string;
    }>;
    imageUrl?: string;
    alt?: string;
  }>;
};

export type ProductReview = {
  _id: string;
  customerName: string;
  rating: number;
  comment: string;
  submittedAt?: string;
};

export type CategoryWithProductCount = Category & {
  productCount: number;
};

export type DiscountProduct = Omit<Product, "categories"> & {
  categories?: string[];
};

const BRAND_BY_ID_QUERY = defineQuery(`*[_type == "brand" && _id == $id][0]`);

const getCategories = async (quantity?: number): Promise<CategoryWithProductCount[]> => {
  try {
    const query = quantity
      ? `*[_type == "category"] | order(title asc)[0...$quantity] { ..., "productCount": count(*[_type == "product" && references(^._id)]) }`
      : `*[_type == "category"] | order(title asc) { ..., "productCount": count(*[_type == "product" && references(^._id)]) }`;

    const { data } = await sanityFetch({
      query,
      params: quantity ? { quantity } : {},
    });

    return (data ?? []) as CategoryWithProductCount[];
  } catch (error) {
    console.log("Error fetching Categories", error);
    return [];
  }
};

const getAllBrands = async (): Promise<Brand[]> => {
  try {
    const { data } = await sanityFetch({ query: BRANDS_QUERY });
    return (data ?? []) as Brand[];
  } catch (error) {
    console.log("Error fetching all brands:", error);
    return [];
  }
};

const getLatestBlogs = async (): Promise<LatestBlogEntry[]> => {
  try {
    const { data } = await sanityFetch({ query: LATEST_BLOG_QUERY });
    return (data ?? []) as LatestBlogEntry[];
  } catch (error) {
    console.log("Error fetching the latest blogs", error);
    return [];
  }
};

const getAllBlogs = async (): Promise<BlogListEntry[]> => {
  const { data } = await sanityFetch({ query: ALL_BLOGS_QUERY });
  return (data ?? []) as BlogListEntry[];
};

const getBlogBySlug = async (slug: string): Promise<BlogArticle | null> => {
  const { data } = await sanityFetch({
    query: BLOG_BY_SLUG_QUERY,
    params: { slug },
  });
  return (data ?? null) as BlogArticle | null;
};

const getApprovedProductReviews = async (
  productId: string,
): Promise<ProductReview[]> => {
  const { data } = await sanityFetch({
    query: PRODUCT_REVIEWS_QUERY,
    params: { productId },
  });
  return (data ?? []) as ProductReview[];
};

const getDiscountProducts = async (): Promise<DiscountProduct[]> => {
  try {
    const { data } = await sanityFetch({ query: DISCOUNTS_PRODUCTS });
    return (data ?? []).map((product) => ({
      ...product,
      status: product.status ? stegaClean(product.status) : undefined,
      variant: product.variant ? stegaClean(product.variant) : undefined,
      categories: (product.categories ?? []).flatMap((category) =>
        category ? [stegaClean(category)] : [],
      ),
    }));
  } catch (error) {
    console.log("Error fetching the discounted products", error);
    return [];
  }
};

const getProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const product = await sanityFetch({
      query: PRODUCT_BY_SLUG_QUERY,
      params: {
        slug,
      },
    });
    return (product?.data ?? null) as Product | null;
  } catch (error) {
    console.error("Error fetching Product by ID:", error);
    return null;
  }
};

const getBrand = async (slug: string): Promise<Brand | null> => {
  try {
    const product = await sanityFetch({
      query: BRAND_QUERY,
      params: {
        slug,
      },
    });
    return (product?.data ?? null) as Brand | null;
  } catch (error) {
    console.error("Error fetching Brand by ID:", error);
    return null;
  }
};

const getBrandById = async (id: string): Promise<Brand | null> => {
  try {
    const { data } = await sanityFetch({ query: BRAND_BY_ID_QUERY, params: { id } });
    return (data ?? null) as Brand | null;
  } catch (error) {
    console.error("Error fetching Brand by ID:", error);
    return null;
  }
};

export {
  getCategories,
  getAllBrands,
  getLatestBlogs,
  getAllBlogs,
  getBlogBySlug,
  getApprovedProductReviews,
  getDiscountProducts,
  getProductBySlug,
  getBrand,
  getBrandById,
};