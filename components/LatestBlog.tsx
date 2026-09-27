import React from "react";
import { Title } from "./ui/text";
import { getLatestBlogs } from "@/sanity/queries";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import dayjs from "dayjs";

const LatestBlog = async() => {
  const blogs = await getLatestBlogs();
  return (
    <div className="px-1">
      <Title>Latest Blog</Title>
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {blogs.map((blog) => (<article key={blog._id} className="group overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
          {blog?.mainImage && (
            <Link href={`/blog/${blog?.slug?.current}`}>
            <Image
            src={urlFor(blog?.mainImage).url()}
            alt="blogImage"
            width={500}
            height={500}
            className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            </Link>
            )}
            <div className="bg-white p-5">
              <div className="flex items-center gap-3 text-xs">
                <div className="relative flex items-center gap-3">
                  {blog?.blogcategories?.map((item, index) => item && (
                    <p key={index} className="font-semibold tracking-wider text-shop-dark-red">
                      {item?.title}
                    </p>
                  ))}
                  <p className="relative flex items-center gap-1 text-light transition-colors group-hover:text-shop-dark-red">
                  <Calendar size={14} aria-hidden="true" />{""}
                  {dayjs(blog.publishedAt).format("MMMM D, YYYY")}
                  </p>
                </div>
              </div>
              <div>
                <Link
                  href={`/blog/${blog?.slug?.current}`}
                  className="mt-4 line-clamp-2 text-base font-semibold leading-snug tracking-tight text-dark transition-colors group-hover:text-shop-dark-red"
                >
                  {blog?.title}
                </Link>
              </div>
            </div>
          </article>
        ))}
        </div>
    </div>
  )
}

export default LatestBlog