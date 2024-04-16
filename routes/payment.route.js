import express from "express";
import { authentication, authorizePermission } from "../middleware/authentication.middleware.js";
import { checkout, verifypayment } from "../controller/payment.contoller.js";

const router = express.Router();

router.route("/checkout").post(checkout);
router.route("/verification").post(verifypayment);

export default router;
