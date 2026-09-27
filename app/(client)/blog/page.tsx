import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ChevronRight, Newspaper } from "lucide-react";
import dayjs from "dayjs";
import Container from "@/components/Container";
import { Title } from "@/components/ui/text";
import { getAllBlogs } from "@/sanity/queries";
import { urlFor } from "@/sanity/lib/image";

export const metadata: Metadata = {
  title: "Blog | Abo Abbas",
  description:
    "Shopping tips, product ideas, and news from Abo Abbas in Lusaka.",
};

export default async function BlogPage() {
  const blogs = await getAllBlogs();

  return (
    <div className="min-h-[60vh] bg-shop-light-bg py-10 sm:py-14">
      <Container>
        <header className="mb-8 sm:mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-shop-dark-red">
            Stories and updates
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Title>From the Abo Abbas blog</Title>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-shop_light_text sm:text-base">
                Ideas, useful tips, and updates from your local shop in Lusaka.
              </p>
            </div>
            {blogs.length > 0 && (
              <p className="text-sm text-shop_light_text">
                {blogs.length} {blogs.length === 1 ? "article" : "articles"}
              </p>
            )}
          </div>
        </header>

        {blogs.length === 0 ? (
          <section className="rounded-2xl border border-black/[0.06] bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-shop-dark-red/[0.07] text-shop-dark-red">
              <Newspaper aria-hidden="true" className="size-6" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-dark">
              New stories are on the way
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-shop_light_text">
              There are no published articles yet. Please check back soon.
            </p>
          </section>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => {
              const href = blog.slug?.current
                ? `/blog/${blog.slug.current}`
                : null;
              const imageUrl = blog.mainImage
                ? urlFor(blog.mainImage).width(900).height(600).fit("crop").url()
                : null;

              return (
                <article
                  key={blog._id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  {href && (
                    <Link
                      href={href}
                      aria-label={`Read ${blog.title ?? "article"}`}
                      className="relative block aspect-[3/2] overflow-hidden bg-shop-light-bg"
                    >
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={blog.title ?? "Abo Abbas blog article"}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center text-shop-dark-red/60">
                          <Newspaper aria-hidden="true" className="size-10" />
                        </div>
                      )}
                    </Link>
                  )}
                  {!href && imageUrl && (
                    <div className="relative aspect-[3/2] overflow-hidden bg-shop-light-bg">
                      <Image
                        src={imageUrl}
                        alt={blog.title ?? "Abo Abbas blog article"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-shop_light_text">
                      {blog.categories?.filter(Boolean).map((category) => (
                        <span
                          key={`${blog._id}-${category}`}
                          className="rounded-full bg-shop-dark-red/[0.07] px-2.5 py-1 font-semibold text-shop-dark-red"
                        >
                          {category}
                        </span>
                      ))}
                      {blog.publishedAt && (
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays aria-hidden="true" className="size-3.5" />
                          <time dateTime={blog.publishedAt}>
                            {dayjs(blog.publishedAt).format("MMMM D, YYYY")}
                          </time>
                        </span>
                      )}
                    </div>
                    {href ? (
                      <Link
                        href={href}
                        className="mt-4 text-lg font-semibold leading-snug tracking-tight text-dark transition-colors group-hover:text-shop-dark-red"
                      >
                        {blog.title ?? "Untitled article"}
                      </Link>
                    ) : (
                      <h2 className="mt-4 text-lg font-semibold leading-snug tracking-tight text-dark">
                        {blog.title ?? "Untitled article"}
                      </h2>
                    )}
                    {blog.authorName && (
                      <p className="mt-2 text-sm text-shop_light_text">
                        By {blog.authorName}
                      </p>
                    )}
                    {href && (
                      <Link
                        href={href}
                        className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-shop-dark-red"
                      >
                        Read article
                        <ChevronRight
                          aria-hidden="true"
                          className="size-4 transition-transform group-hover:translate-x-0.5"
                        />
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}
