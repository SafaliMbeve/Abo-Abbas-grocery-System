import {BasketIcon} from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const orderType = defineType ({
    name: "order",
    title: "Order",
    type: "document",
    icon: BasketIcon,
    fields: [
        defineField({
        name: "orderNumber",
        title: "Order Number",
        type: "string",
        validation: (Rule) => Rule.required(),
        }),
        {
            name: "invoice",
            type: "object",
            fields:[
                {name: "id", type:"string"},
                {name: "number", type:"string"},
                {name: "hosted_invoice_url", type:"url"},
            ],
        },
        defineField({
            name: "stripeCheckoutSessionId",
            title: "Stripe Checkout Session ID",
            type: "string"
        }),
        defineField({
            name: "stripeCustomerId",
            title: "Stripe Customer ID",
            type: "string",
        }),
        defineField({
            name: "paymentProvider",
            title: "Payment Provider",
            type: "string",
            options: {
                list: [
                    {title: "Flutterwave", value: "flutterwave"},
                    {title: "Stripe", value: "stripe"},
                    {title: "School demo (simulated)", value: "demo"},
                ],
            },
        }),
        defineField({
            name: "paymentReference",
            title: "Payment Reference",
            type: "string",
        }),
        defineField({
            name: "paymentStatus",
            title: "Payment Status",
            type: "string",
            options: {
                list: [
                    {title: "Pending", value: "pending"},
                    {title: "Paid", value: "paid"},
                    {title: "Failed", value: "failed"},
                ],
            },
        }),
        defineField({
            name: "paymentTransactionId",
            title: "Payment Transaction ID",
            type: "string",
        }),
        defineField({
            name: "paidAt",
            title: "Paid At",
            type: "datetime",
        }),
        defineField({
            name: "clerkUserId",
            title: "Store User ID",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "customerName",
            title: "Customer Name",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "email",
            title: "Customer Email",
            type: "string",
            validation: (Rule) => Rule.required().email(),
        }),
        defineField({
            name: "StripePaymentIntentID",
            title: "Stripe Payment Intent ID",
            type: "string",
        }),
        defineField({
            name: "deliveryPhone",
            title: "Delivery Phone",
            type: "string",
        }),
        defineField({
            name: "deliveryNetwork",
            title: "Mobile Money Network",
            type: "string",
            options: {
                list: [
                    {title: "MTN", value: "MTN"},
                    {title: "Airtel", value: "Airtel"},
                    {title: "Zamtel", value: "Zamtel"},
                ],
            },
        }),
        defineField({
            name: "inventoryIssue",
            title: "Inventory Needs Review",
            type: "boolean",
            initialValue: false,
        }),
        defineField({
            name: "product",
            title: "Products",
            type: "array",
            of: [
                defineArrayMember({
                    type: "object",
                    fields: [
                      defineField({
                        name: "product",
                        title: "Product Bought",
                        type: "reference",
                        to: [{type: "product"}],
                      }) ,
                      defineField({
                        name: "quantity",
                        title: "Quantity Purchased",
                        type: "number",
                      }) ,
                      defineField({
                        name: "name",
                        title: "Product Name at Purchase",
                        type: "string",
                      }),
                      defineField({
                        name: "unitPrice",
                        title: "Unit Price at Purchase",
                        type: "number",
                      }),
                    ],
                    preview: {
                        select: {
                            product: "name",
                            quantity: "quantity",
                            image: "product.images.0",
                            price: "unitPrice",
                        },
                        prepare(select) {
                            return{
                                title: `${select.product ?? "Product"} × ${select.quantity ?? 0}`,
                                subtitle:`${(select.price ?? 0) * (select.quantity ?? 0)} ZMW`,
                                media: select.image,
                            };
                        },
                    },
                }),
            ],
        }),
        defineField({
            name: "totalPrice",
            title: "Total Price",
            type: "string",
            validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
            name: "currency",
            title: "Currency",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "amountDiscount",
            title: "Amount Discount",
            type: "number",
            validation: (Rule) => Rule.required(), 
        }),
        defineField({
            name: "address",
            title: "Delivery Address",
            type: "object",
            fields: [
                defineField({name: "zip", title: "Zip Code", type: "string"}),
                defineField({name: "city", title: "City", type: "string"}),
                defineField({name: "address", title: "Address", type: "string"}),
                defineField({name: "name", title: "Name", type: "string"}),
                defineField({name: "state", title: "Province", type: "string"}),
            ]
        }),
        defineField({
            name: "status",
            title: "Order Status",
            type: "string",
            options:{
                list: [
                    {title: "Pending", value: "pending"},
                    {title: "Processing", value: "processing"},
                    {title: "Paid", value: "paid"},
                    {title: "Shipped", value: "shipped"},
                    {title: "Out For Delivery", value: "out_for_delivery"},
                    {title: "Delivered", value: "delivered"},
                    {title: "Cancelled", value: "cancelled"},
                ],
            },
        }),
        defineField({
            name: "orderDate",
            title: "Order date",
            type: "datetime",
            validation: (Rule) => Rule.required(),
        }),
    ],
    preview: {
        select: {
            name: "customerName",
            amount: "totalPrice",
            currency: "currency",
            orderId: "orderNumber",
            email: "email",
        },
        prepare(select) {
            const orderId = select.orderId ?? "No order number";
            const orderIdSnippet = orderId.length > 10
                ? `${orderId.slice(0, 5)}...${orderId.slice(-4)}`
                : orderId;
            return {
                title: `${select.name} (${orderIdSnippet})`,
                subtitle: `${select.amount} ${select.currency}, ${select.email}`,
                media: BasketIcon
            };
        },
    },
});