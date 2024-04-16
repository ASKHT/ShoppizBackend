import Order from "../model/order.model.js";
import Product from "../model/product.model.js";
import asyncWrapper from "../middleware/asyncWrapper.middleware.js";
import ApiError from "../utils/apiError.util.js";

export const getAllOrder = asyncWrapper(async (req, res, next) => {});

export const getSingleOrder = asyncWrapper(async (req, res, next) => {
    const orderId = req.params.orderId;

    const order = await Order.findOne({ order_id: orderId });
    if (!order) {
        throw next(new ApiError(404, "Order does not exist"));
    }
    res.status(200).json(order);
});

export const getCurrentUserOrder = asyncWrapper(async (req, res, next) => {
    const user = req.user.id;

    const orders = await Order.find({ user: user, paymentStatus: 'paid' });
    if (!user) {
        throw next(new ApiError(404, "User does not exist"));
    }
    res.status(200).json(orders);
});

// create order
export const createOrder = asyncWrapper(async (req, res, next) => {
    const { shippingFee, cartItems, paymentIntentId, clientSecret } = req.body;
    if (!shippingFee || !paymentIntentId || !clientSecret) {
        return next(new ApiError(400, "required data missing"));
    }
    if (!cartItems || cartItems.length < 1) {
        return next(new ApiError(400, "cart items cannot be empty"));
    }

    let orderItems = [];
    let total = 0;

    for (const item of cartItems) {
        const checkProduct = await Product.findOne({ _id: item.product });
        if (!checkProduct) {
            return next(new ApiError(400, `product does not exist`));
        }
        const { name, price, image, _id } = checkProduct;
        const singleOrderItems = {
            quantity: item.quantity,
            name,
            price,
            image,
            product: _id,
        };
        orderItems = [...orderItems, singleOrderItems];
        total += item.quantity * price;
    }
    total += shippingFee;
    req.body.user = req.user.id;
    const order = await Order.create(req.body);
    res.status(200).json(order);
});

export const updateOrder = asyncWrapper(async (req, res, next) => {});
