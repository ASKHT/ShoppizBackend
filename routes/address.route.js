import express from "express";
import { getAddress, addAddress, updateAddress, removeAddress } from "../controller/address.controller.js";
import { authentication } from "../middleware/authentication.middleware.js";

const router = express.Router();

router.route("/").get(authentication, getAddress).post(authentication, addAddress);

router.route("/:address_id").patch(authentication, updateAddress).delete(authentication, removeAddress);

export default router;
