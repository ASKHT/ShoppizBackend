import { Schema, model, Types } from "mongoose";

const singleCartItemSchema = new Schema({
    name: { type: String, default: null },
    image: { type: String, default: null },
    quantity: { type: String, default: null },
    price: { type: Number, default: null },
    product: {
        type: Types.ObjectId,
        ref: "Product",
        required: true,
    },
});

const orderSchema = new Schema(
    {
        shippingFee: {
            type: Number,
            required: true,
        },
        total: {
            type: Number,
            default: null,
        },
        cartItems: {
            type: [singleCartItemSchema],
            required: true,
        },
        status: {
            type: String,
            enum: ["processing", "shipped", "delivered", "cancelled", "return"],
            default: "processing",
        },
        paymentStatus: {
            type: String,
            enum: ["paid", "not paid", "refund complete"],
            default: "not paid",
        },
        user: {
            type: Types.ObjectId,
            ref: "User",
            default: null,
        },
        clientSecret: {
            type: String,
            default: null,
        },
        paymentIntentId: {
            type: String,
            default: null,
        },

        razorpay_payment_id: {
            type: String,
            default: null,
        },
        razorpay_order_id: {
            type: String,
            default: null,
        },
        razorpay_signature: {
            type: String,
            default: null,
        },
        order_id: {
            type: String,
        },
    },
    { timestamps: true }
);

const Order = model("Order", orderSchema);
export default Order;

// import {Schema, model, Types} from 'mongoose'

// const singleCartItemSchema = new Schema({
//     name: {type: String, required: true},
//     image: {type: String, requried: true},
//     quantity: {type: String, required: true},
//     price: {type: Number, required: true},
//     product: {
//         type: Types.ObjectId,
//         ref: 'Product',
//         required: true
//     }
// })

// const orderSchema = new Schema({
//     shippingFee: {
//         type: Number,
//         required: true
//     },
//     total: {
//         type: Number,
//         required: true
//     },
//     cartItems: {
//         type: [singleCartItemSchema],
//         required: true
//     },
//     status: {
//         type: String,
//         enum: ['pending', 'shipped', 'delivered', 'cancelled', 'return'],
//         default: 'pending'
//     },
//     paymentStatus: {
//         type: String,
//         enum: ['paid', 'not paid', 'refund complete'],
//         default: 'not paid'
//     },
//     user: {
//         type: Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
// }, {timestamps: true})

// const Order = model('Order', orderSchema)
// export default Order
