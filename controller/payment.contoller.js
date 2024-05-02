import Razorpay from "razorpay";
import crypto from "crypto";

import Order from "../model/order.model.js";
import Product from "../model/product.model.js";

const razorpay = new Razorpay({
    key_id: process.env.APP_RAZORPAY_KEY_ID,
    key_secret: process.env.APP_RAZORPAY_KEY_SECRET,
});

const checkout = async (req, res) => {
    const cart = req.body;
    const products = cart.cartItems;

    const arrayofcartitems = [];

    for (const item of products) {
        const { product, quantity, totalPrice } = item;
        const name = item.product.name;
        const cartItemObj = {
            name: name,
            quantity: quantity,
            product: product._id,
            price: totalPrice,
        };

        arrayofcartitems.push(cartItemObj);
    }

    const options = {
        amount: cart.cartTotal * 100 + 10000,
        currency: "INR",
    };
    const order = await razorpay.orders.create(options);
    // const user = item.product.user;
    const newOrder = new Order({
        shippingFee: 100,
        cartItems: arrayofcartitems,
        status: "processing",
        paymentStatus: "not paid",
        clientSecret: "mockClientSecret",
        paymentIntentId: "mockPaymentIntentId",
        order_id: order.id,
        user: cart.user,
        total: options.amount / 100,
    });
    const savedOrder = await newOrder.save();
    res.status(200).json({ success: "success", order });
};

const verifypayment = async (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    const body_data = razorpay_order_id + "|" + razorpay_payment_id;

    const secret = process.env.APP_RAZORPAY_KEY_SECRET;

    const expect = crypto.createHmac("sha256", secret).update(body_data).digest("hex");
    const isValid = expect === razorpay_signature;
    console.isValid;
    if (isValid) {
        try {
            const order = await Order.findOneAndUpdate(
                { order_id: razorpay_order_id },
                {
                    $set: {
                        paymentStatus: "paid",
                        razorpay_payment_id: razorpay_payment_id,
                        razorpay_order_id: razorpay_order_id,
                        razorpay_signature: razorpay_signature,
                    },
                },
                { new: true }
            );
            order.cartItems.map(async (item) => {
                const product = await Product.findOne({ _id: item.product });
                product.quantity -= Number(item.quantity);
                await product.save()
            });
        } catch (error) {
            console.error("Error updating order:", error);
            // Handle error appropriately
        }
        res.redirect("https://shoppiz-frontend.vercel.app//success");
    } else {
        await Order.findOneAndDelete({ order_id: razorpay_order_id });
        res.redirect("https://shoppiz-frontend.vercel.app//failed");
    }
};

export { checkout, verifypayment };
