import express from "express";
import { createReview, getProductReview } from "../controller/review.controller.js";
import { authentication } from "../middleware/authentication.middleware.js";
const router = express.Router();

router.route("/").post(authentication, createReview);

router.route("/:productId").get(getProductReview);

export default router;
