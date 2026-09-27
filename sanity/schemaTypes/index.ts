import { type SchemaTypeDefinition } from "sanity"
import { categoryType } from "./categoryType";
import {blockContentType} from "./blockContentType";
import {brandType} from "./brandType";
import {productType} from "./productType";
import {orderType} from "./orderType";
import {addressType} from "./addressType";
import {blogType} from "./blogType";
import {blogCategoryType} from "./blogCategoryType";
import {authorType} from "./authorType";
import {newsletterSubscriberType} from "./newsletterSubscriberType";
import {reviewType} from "./reviewType";



export const schema:{types:SchemaTypeDefinition[]}={
  types: [
    categoryType,
    blockContentType,
    brandType,
    blogType,
    authorType,
    blogCategoryType,
    addressType,
    productType,
    orderType,
    newsletterSubscriberType,
    reviewType
  ],
};
