import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const newsletterSubscriberType = defineType({
  name: "newsletterSubscriber",
  title: "Newsletter subscriber",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "email",
      title: "Email address",
      type: "email",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "isActive",
      title: "Subscription active",
      type: "boolean",
      initialValue: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subscribedAt",
      title: "Subscribed at",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "email",
      isActive: "isActive",
      subscribedAt: "subscribedAt",
    },
    prepare({ title, isActive, subscribedAt }) {
      return {
        title: title ?? "Newsletter subscriber",
        subtitle: `${isActive ? "Subscribed" : "Unsubscribed"}${
          subscribedAt ? ` · ${new Date(subscribedAt).toLocaleDateString()}` : ""
        }`,
      };
    },
  },
});
