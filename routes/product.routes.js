import express from "express";
import {
    getAllProducts,
    getSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
} from "../controller/product.controller.js";
import { getProductReview } from "../controller/review.controller.js";
import { authentication, authorizePermission } from "../middleware/authentication.middleware.js";
import upload from '../middleware/multer.middleware.js'

const router = express.Router();

router.route("/").post(authentication, authorizePermission("admin"),upload.array('images'), createProduct);
router.route("/:category").get(getAllProducts);

router.route("/single-product/uploadImage").post(authentication, authorizePermission("admin"), uploadImage);

router
    .route("/single-product/:id")
    .get(getSingleProduct)
    .patch(authentication, authorizePermission("admin"), updateProduct)
    .delete(authentication, authorizePermission("admin"), deleteProduct);

router.route("/:id/review").get(getProductReview);

export default router;
