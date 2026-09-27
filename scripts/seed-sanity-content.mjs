import { randomUUID } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";
import { createClient } from "@sanity/client";

const { loadEnvConfig } = nextEnv;
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadEnvConfig(projectRoot);

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-09-06";
const readToken = process.env.SANITY_API_READ_TOKEN;
const writeToken = process.env.SANITY_API_WRITE_TOKEN;
const applyChanges = process.argv.includes("--apply");
const assetsDirectory = path.join(projectRoot, "public", "Products");

if (!projectId || !dataset || !readToken) {
  throw new Error("Sanity project, dataset, and read token are required.");
}
if (applyChanges && !writeToken) {
  throw new Error("SANITY_API_WRITE_TOKEN is required when running with --apply.");
}

const readClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: readToken,
  perspective: "raw",
  useCdn: false,
});
const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: writeToken ?? readToken,
  perspective: "raw",
  useCdn: false,
});
const client = applyChanges ? writeClient : readClient;
const demoDate = new Date().toISOString();
const slugify = (value) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const makeKey = () => randomUUID().replace(/-/g, "");
const imageAliases = new Map([
  ["aesos-lotion", "aesos-lotion"],
  ["american-single-cheeses", "american-cheese-slices"],
  ["aveeno-lotion", "aveeno-body-lotion"],
  ["bacon", "homel-black-label-bacon"],
  ["banana", "bananas"],
  ["basmati-rice", "daawat-basmati-rice"],
]);

const blogDrafts = [
  {
    title: "A simple plan for your weekly grocery shop",
    category: "Shopping Guides",
    paragraphs: [
      "A little planning can make a grocery shop easier. Before you browse, take a quick look at what you already have at home and note the essentials you are running low on.",
      "Plan a few meals around your schedule, then make a list of the ingredients you need. A list helps you compare products and quantities while keeping your basket focused on what you intend to use.",
      "When you shop online, review the products and quantities in your cart before checkout. Check the displayed total and delivery details, and contact the shop if anything in your order needs clarification.",
    ],
  },
  {
    title: "A few practical tips for storing groceries",
    category: "Food and Home",
    paragraphs: [
      "Different foods need different storage conditions. Check product packaging for storage directions, and put chilled or frozen products away promptly after shopping.",
      "Keep raw meat sealed and separate from ready-to-eat foods. Wash fresh produce under clean running water before preparing it, and use clean surfaces and utensils when handling food.",
      "For packaged products, follow the storage and use-by guidance on the label. If you are unsure whether a food is safe to eat, do not rely on appearance alone.",
    ],
  },
  {
    title: "How to place an order with Abo Abbas",
    category: "Store News",
    paragraphs: [
      "Browse the shop and add the products you want to your cart. From the cart, continue to checkout to review your order and provide a delivery address and mobile-money details.",
      "The current online checkout supports MTN, Airtel, and Zamtel mobile money through Flutterwave. Zambian mobile-money checkout requires a whole-kwacha order total.",
      "After continuing to payment, follow the provider instructions. An order is marked paid only after the payment provider confirms it. If a payment status is unclear, contact the shop with your order number before trying again.",
    ],
  },
];

function productCategory(name) {
  const value = name.toLowerCase();
  if (/\b(lotion|bodywash|body wash|soap|scrub|vaseline|nivea|aveeno|eos)\b/.test(value)) {
    return { title: "Skin Care", variant: "skincare" };
  }
  if (/\b(bacon|chicken|beef|ham|pork|sausage|steak|shrimp)\b/.test(value)) {
    return { title: "Meat", variant: "other" };
  }
  if (
    /\b(banana|pepper|broccoli|butternut|cabbage|carrot|cauliflower|tomato|corn|cucumber|eggplant|garlic|grape|beans|mushroom|onion|orange|spinach|strawberry|potato)\b/.test(
      value,
    )
  ) {
    return { title: "Fresh Produce", variant: "freshproduce" };
  }
  if (/\b(doritos|cereal|oreo|lays|takis|popcorn|chocolate|kikat|redbull|cadbury|m&m)\b/.test(value)) {
    return { title: "Other", variant: "snacks" };
  }
  if (/\b(wipes|huggies|tissue|washing|clorox|harpic|sta-soft|dishwashing)\b/.test(value)) {
    return { title: "Other", variant: "toiletries" };
  }
  return { title: "Other", variant: "other" };
}

function titleFromFilename(filename) {
  return path
    .parse(filename)
    .name.replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function imageContentType(filename) {
  const extension = path.extname(filename).toLowerCase();
  const contentTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".avif": "image/avif",
  };
  return contentTypes[extension];
}

function portableText(paragraphs) {
  return paragraphs.map((text) => ({
    _key: makeKey(),
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [{ _key: makeKey(), _type: "span", marks: [], text }],
  }));
}

async function ensureNamedDocument(type, title, extra = {}) {
  const existing = await client.fetch(
    `*[_type == $type && (title == $title || name == $title)][0]{_id}`,
    { type, title },
  );
  if (existing) return existing._id;

  if (!applyChanges) return `DRY_RUN:${type}:${slugify(title)}`;
  const created = await writeClient.create({
    _type: type,
    title,
    slug: { _type: "slug", current: slugify(title) },
    ...extra,
  });
  return created._id;
}

const entries = (await readdir(assetsDirectory, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && /\.(jpe?g|png|webp|avif)$/i.test(entry.name))
  .filter((entry) => !/^(empty cart|shopping cart)$/i.test(path.parse(entry.name).name))
  .sort((left, right) => left.name.localeCompare(right.name));

const filenames = entries.map((entry) => entry.name);
const [products, assets, categories, authors, blogCategories, existingBlogs, existingReviews] =
  await Promise.all([
    client.fetch(
      `*[_type == "product"]{_id,name,"slug":slug.current,images[]{"assetId":asset._ref,"filename":asset->originalFilename}}`,
    ),
    client.fetch(
      `*[_type == "sanity.imageAsset" && originalFilename in $filenames]{_id,originalFilename}`,
      { filenames },
    ),
    client.fetch(`*[_type == "category"]{_id,title}`),
    client.fetch(`*[_type == "author"]{_id,name}`),
    client.fetch(`*[_type == "blogcategory"]{_id,title}`),
    client.fetch(`*[_type == "blog"]{_id,title}`),
    client.fetch(
      `*[_type == "review"]{_id,customerName,"productId":product._ref,isSample}`,
    ),
  ]);

const assetsByFilename = new Map(
  assets.map((asset) => [asset.originalFilename?.toLowerCase(), asset]),
);
const productsBySlug = new Map(
  products.map((product) => [product.slug, product]),
);
const categoriesByTitle = new Map(
  categories.map((category) => [category.title, category]),
);
const unmatchedProducts = entries.filter((entry) => {
  const sourceSlug = slugify(path.parse(entry.name).name);
  return !productsBySlug.has(imageAliases.get(sourceSlug) ?? sourceSlug);
});
const missingBlogs = blogDrafts.filter(
  (blog) => !existingBlogs.some((existing) => existing.title === blog.title),
);
const plannedDemoReviews = products.filter(
  (product) =>
    !existingReviews.some(
      (review) => review.productId === product._id && review.isSample,
    ),
);

console.log(`Target dataset: ${projectId}/${dataset}`);
console.log(`Product images to import: ${entries.length}`);
console.log(`Existing product records to match: ${entries.length - unmatchedProducts.length}`);
console.log(`New product drafts to create: ${unmatchedProducts.length}`);
console.log(`Product image assets already uploaded: ${assets.length}`);
console.log(`Blog drafts to create: ${missingBlogs.length}`);
console.log(`Demo review drafts to create: ${plannedDemoReviews.length}`);
console.log(`Mode: ${applyChanges ? "APPLY" : "DRY RUN"}`);

if (!applyChanges) {
  console.log("No Sanity data was changed. Re-run with --apply to perform the import.");
  process.exit(0);
}

const categoryIds = new Map();
for (const categoryTitle of ["Other", "Skin Care", "Meat", "Fresh Produce"]) {
  let category = categoriesByTitle.get(categoryTitle);
  if (!category) {
    const created = await writeClient.create({
      _type: "category",
      title: categoryTitle,
      slug: { _type: "slug", current: slugify(categoryTitle) },
      featured: false,
    });
    category = { _id: created._id, title: categoryTitle };
  }
  categoryIds.set(categoryTitle, category._id);
}

const imageDocuments = [];
for (const [index, entry] of entries.entries()) {
  const filename = entry.name;
  let asset = assetsByFilename.get(filename.toLowerCase());
  if (!asset) {
    const buffer = await readFile(path.join(assetsDirectory, filename));
    asset = await writeClient.assets.upload("image", buffer, {
      filename,
      contentType: imageContentType(filename),
    });
    assetsByFilename.set(filename.toLowerCase(), asset);
  }
  imageDocuments.push({ filename, assetId: asset._id });
  if ((index + 1) % 20 === 0 || index + 1 === entries.length) {
    console.log(`Uploaded or matched image ${index + 1}/${entries.length}`);
  }
}

for (const image of imageDocuments) {
  const sourceSlug = slugify(path.parse(image.filename).name);
  const matchedSlug = imageAliases.get(sourceSlug) ?? sourceSlug;
  const matchingProduct = productsBySlug.get(matchedSlug);
  const imageFilenameExists = matchingProduct?.images?.some(
    (existingImage) =>
      existingImage.filename?.toLowerCase() === image.filename.toLowerCase(),
  );
  if (matchingProduct) {
    if (!imageFilenameExists) {
      await writeClient
        .patch(matchingProduct._id)
        .setIfMissing({ images: [] })
        .append("images", [
          {
            _key: makeKey(),
            _type: "image",
            asset: { _type: "reference", _ref: image.assetId },
          },
        ])
        .commit();
    }
    continue;
  }

  const name = titleFromFilename(image.filename);
  const slug = slugify(name);
  const existingBySlug = await writeClient.fetch(
    `*[_type == "product" && slug.current == $slug][0]{_id}`,
    { slug },
  );
  if (existingBySlug) continue;

  const category = productCategory(name);
  await writeClient.create({
    _id: `drafts.${randomUUID()}`,
    _type: "product",
    name,
    slug: { _type: "slug", current: slug },
    images: [
      {
        _key: makeKey(),
        _type: "image",
        asset: { _type: "reference", _ref: image.assetId },
      },
    ],
    discount: 0,
    variant: category.variant,
    categories: [
      {
        _key: makeKey(),
        _type: "reference",
        _ref: categoryIds.get(category.title),
      },
    ],
  });
}

const authorName = "Abo Abbas Team";
let authorId = authors.find((author) => author.name === authorName)?._id;
if (!authorId) {
  authorId = (
    await writeClient.create({
      _type: "author",
      name: authorName,
      slug: { _type: "slug", current: slugify(authorName) },
    })
  )._id;
}

const blogCategoryIds = new Map(
  blogCategories.map((category) => [category.title, category._id]),
);
for (const categoryTitle of [
  ...new Set(blogDrafts.map((blog) => blog.category)),
]) {
  if (!blogCategoryIds.has(categoryTitle)) {
    const created = await ensureNamedDocument("blogcategory", categoryTitle, {
      description: "Articles and updates from the Abo Abbas shop.",
    });
    blogCategoryIds.set(categoryTitle, created);
  }
}

for (const blog of missingBlogs) {
  await writeClient.create({
    _id: `drafts.${randomUUID()}`,
    _type: "blog",
    title: blog.title,
    slug: { _type: "slug", current: slugify(blog.title) },
    author: { _type: "reference", _ref: authorId },
    blogcategories: [
      {
        _key: makeKey(),
        _type: "reference",
        _ref: blogCategoryIds.get(blog.category),
      },
    ],
    publishedAt: demoDate,
    isLatest: false,
    body: portableText(blog.paragraphs),
  });
}

const reviewComments = [
  "DEMO ONLY — fictional sample content for preview. This is not a real customer review and must never be published as a testimonial.",
  "DEMO ONLY — fictional sample content for layout testing. No customer experience is represented; keep this document unpublished.",
  "DEMO ONLY — example review record. This rating and comment are invented and must not be shown as genuine feedback.",
];
for (const [index, product] of plannedDemoReviews.entries()) {
  await writeClient.create({
    _id: `drafts.${randomUUID()}`,
    _type: "review",
    product: { _type: "reference", _ref: product._id },
    customerName: "DEMO ONLY — NOT A CUSTOMER",
    rating: 5,
    comment: reviewComments[index % reviewComments.length],
    status: "pending",
    isSample: true,
    submittedAt: demoDate,
  });
}

console.log("Sanity content import completed.");
console.log(
  "New products, blog posts, and demo reviews are drafts. Add verified prices and stock before publishing products; never publish the demo reviews.",
);
