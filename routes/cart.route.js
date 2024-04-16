import express from "express";
import { getCart, removeFromCart, addToCart, removeAllCart } from "../controller/cart.controller.js";
import { authentication } from "../middleware/authentication.middleware.js";
const router = express.Router();

router.route("/").get(authentication, getCart).post(authentication, addToCart).delete(authentication, removeAllCart);

router.route("/:product_id").delete(authentication, removeFromCart);

export default router;
