import Image from "next/image";
import type { ReactNode } from "react";
import type { BlogArticle } from "@/sanity/queries";

function renderText(
  text: string,
  marks: string[] | undefined,
  markDefs: NonNullable<BlogArticle["body"]>[number]["markDefs"],
  key: string,
) {
  let content: ReactNode = text;

  for (const mark of [...(marks ?? [])].reverse()) {
    const definition = markDefs?.find((item) => item._key === mark);
    if (definition?._type === "link") {
      const href = definition.href ?? definition[" href"];
      content = href ? (
        <a
          key={`${key}-${mark}`}
          href={href}
          rel={href.startsWith("http") ? "noreferrer" : undefined}
          className="font-medium text-shop-dark-red underline decoration-shop-dark-red/30 underline-offset-4 hover:decoration-shop-dark-red"
        >
          {content}
        </a>
      ) : (
        content
      );
    } else if (mark === "strong") {
      content = <strong key={`${key}-${mark}`}>{content}</strong>;
    } else if (mark === "em") {
      content = <em key={`${key}-${mark}`}>{content}</em>;
    }
  }

  return <span key={key}>{content}</span>;
}

export default function BlogArticleBody({
  body,
}: {
  body: BlogArticle["body"];
}) {
  if (!body?.length) {
    return (
      <p className="text-sm leading-7 text-shop_light_text">
        This article does not have any content yet.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {body.map((block) => {
        if (block._type === "image" && block.imageUrl) {
          return (
            <figure key={block._key} className="my-8">
              <Image
                src={block.imageUrl}
                alt={block.alt ?? ""}
                width={1200}
                height={800}
                className="h-auto w-full rounded-2xl object-cover"
              />
              {block.alt && (
                <figcaption className="mt-2 text-center text-xs text-shop_light_text">
                  {block.alt}
                </figcaption>
              )}
            </figure>
          );
        }

        if (block._type !== "block") return null;

        const children = (block.children ?? []).map((child) =>
          renderText(child.text ?? "", child.marks, block.markDefs, child._key),
        );
        const className = "text-sm leading-7 text-shop_light_text sm:text-base";

        if (block.listItem === "bullet") {
          return (
            <ul key={block._key} className="list-disc space-y-2 pl-6">
              <li className={className}>{children}</li>
            </ul>
          );
        }

        switch (block.style) {
          case "h1":
            return (
              <h2 key={block._key} className="text-2xl font-semibold text-dark">
                {children}
              </h2>
            );
          case "h2":
            return (
              <h2 key={block._key} className="text-xl font-semibold text-dark">
                {children}
              </h2>
            );
          case "h3":
            return (
              <h3 key={block._key} className="text-lg font-semibold text-dark">
                {children}
              </h3>
            );
          case "h4":
            return (
              <h4 key={block._key} className="font-semibold text-dark">
                {children}
              </h4>
            );
          case "blockquote":
            return (
              <blockquote
                key={block._key}
                className="border-l-4 border-shop-dark-red/30 pl-4 text-base italic leading-7 text-shop_light_text"
              >
                {children}
              </blockquote>
            );
          default:
            return (
              <p key={block._key} className={className}>
                {children}
              </p>
            );
        }
      })}
    </div>
  );
}
