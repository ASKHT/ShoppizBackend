import asyncWrapper from "../middleware/asyncWrapper.middleware.js";
import Cart from "../model/cart.model.js";
import { singleCartItems } from "../model/cart.model.js";
import User from "../model/user.model.js";
import ApiError from "../utils/apiError.util.js";

// get cart details
const getCart = asyncWrapper(async (req, res, next) => {
    const user_id = req.user.id;
    const cart = await Cart.findOne({ user: user_id }).populate({
        path: "cartItems.product",
        model: "Product",
    });
    res.status(200).json({ success: true, cart });
});

// add item to cart
const addToCart = asyncWrapper(async (req, res, next) => {
    const user_id = req.user.id;
    const { product_id, quantity } = req.body;
    let cart = await Cart.findOne({ user: user_id });
    if (!cart) {
        cart = await Cart.create({
            user: user_id,
            cartItems: [{ quantity, product: product_id }],
        });
    } else {
        const existingItem = cart.cartItems.findIndex((item) => item.product.toString() === product_id.toString());

        if (existingItem > -1) {
            cart.cartItems[existingItem].quantity = quantity;
        } else {
            cart.cartItems.push({ quantity, product: product_id });
        }
        await cart.save();
    }
    res.status(200).json({ success: true, cart });
});

// remove item from cart
const removeFromCart = asyncWrapper(async (req, res, next) => {
    const user_id = req.user.id;
    const { product_id } = req.params;
    const cart = await Cart.findOne({ user: user_id });
    const removeitemIdx = cart.cartItems.findIndex((item) => item.product.toString() === product_id);
    if (removeitemIdx > -1) {
        cart.cartItems.splice(removeitemIdx, 1);
    }
    // console.log(cart.cartItems)
    await cart.save();
    res.status(200).json({ success: true });
});

// remove all items from cart
const removeAllCart = asyncWrapper(async (req, res, next) => {
    const user_id = req.user.id;
    const cart = await Cart.findOne({ user: user_id });
    cart.cartItems = []
    await cart.save();
    res.status(200).json({message: "Cart removed successfully", cart });
});

export { addToCart, removeFromCart, removeAllCart, getCart };
