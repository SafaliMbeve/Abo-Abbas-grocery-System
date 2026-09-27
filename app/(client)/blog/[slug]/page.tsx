import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import dayjs from "dayjs";
import BlogArticleBody from "@/components/BlogArticleBody";
import Container from "@/components/Container";
import { getBlogBySlug } from "@/sanity/queries";
import { urlFor } from "@/sanity/lib/image";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return { title: "Article not found | Abo Abbas" };
  }

  return {
    title: `${blog.title ?? "Blog"} | Abo Abbas`,
    description: `Read ${blog.title ?? "this article"} on the Abo Abbas blog.`,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) notFound();

  const imageUrl = blog.mainImage
    ? urlFor(blog.mainImage).width(1400).height(800).fit("crop").url()
    : null;

  return (
    <article className="min-h-[60vh] bg-shop-light-bg py-8 sm:py-12">
      <Container>
        <Link
          href="/blog"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-shop_light_text transition-colors hover:text-shop-dark-red"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          All articles
        </Link>

        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-sm">
          {imageUrl && (
            <div className="relative aspect-[16/8] bg-shop-light-bg">
              <Image
                src={imageUrl}
                alt={blog.title ?? "Abo Abbas blog article"}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          )}

          <div className="px-5 py-7 sm:px-10 sm:py-10">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-shop_light_text">
              {blog.categories?.filter(Boolean).map((category) => (
                <span
                  key={`${blog._id}-${category}`}
                  className="rounded-full bg-shop-dark-red/[0.07] px-3 py-1 text-xs font-semibold text-shop-dark-red"
                >
                  {category}
                </span>
              ))}
              {blog.publishedAt && (
                <time
                  dateTime={blog.publishedAt}
                  className="inline-flex items-center gap-1.5"
                >
                  <CalendarDays aria-hidden="true" className="size-4" />
                  {dayjs(blog.publishedAt).format("MMMM D, YYYY")}
                </time>
              )}
              {blog.authorName && <span>By {blog.authorName}</span>}
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-dark sm:text-4xl">
              {blog.title ?? "Untitled article"}
            </h1>

            <div className="mt-8 border-t border-black/[0.06] pt-7 sm:mt-10 sm:pt-9">
              <BlogArticleBody body={blog.body} />
            </div>
          </div>
        </div>
      </Container>
    </article>
  );
}
