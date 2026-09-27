import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const reviewType = defineType({
  name: "review",
  title: "Product review",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "customerName",
      title: "Customer name",
      type: "string",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (rule) => rule.required().integer().min(1).max(5),
    }),
    defineField({
      name: "comment",
      title: "Review",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().min(5).max(2000),
    }),
    defineField({
      name: "status",
      title: "Moderation status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Approved", value: "approved" },
          { title: "Rejected", value: "rejected" },
        ],
        layout: "radio",
      },
      initialValue: "pending",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "isSample",
      title: "Demo content (never publish)",
      type: "boolean",
      description:
        "Fictional preview/test records must remain marked as samples and must never be used as genuine customer feedback.",
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted at",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "customerName",
      subtitle: "comment",
      rating: "rating",
      status: "status",
      isSample: "isSample",
    },
    prepare({ title, subtitle, rating, status, isSample }) {
      return {
        title: `${title ?? "Review"}${isSample ? " · DEMO ONLY" : ""}`,
        subtitle: `${rating ?? "?"}/5 · ${status ?? "pending"} · ${
          subtitle ?? ""
        }`,
      };
    },
  },
});
