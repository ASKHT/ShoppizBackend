import asyncWrapper from "../middleware/asyncWrapper.middleware.js";
import Address from "../model/address.model.js";
import Cart from "../model/cart.model.js";
import { singleCartItems } from "../model/cart.model.js";
import User from "../model/user.model.js";
import ApiError from "../utils/apiError.util.js";

// get all address
const getAddress = asyncWrapper(async (req, res, next) => {
    const user_id = req.user.id;
    const address = await Address.find({ user: user_id });
    res.status(200).json({ success: true, address });
});

// add address
const addAddress = asyncWrapper(async (req, res, next) => {
    const user_id = req.user.id;
    const { name, mobile, street, city, state, country, zipcode } = req.body;

    if (!name || !mobile || !street || !city || !state || !country || !zipcode) {
        throw next(new ApiError(400, "Required field missing"));
    }
    req.body.user = user_id;
    const address = await Address.create(req.body);
    res.status(200).json({ success: true });
});

// remove address
const removeAddress = asyncWrapper(async (req, res, next) => {
    const user_id = req.user.id;
    const { address_id } = req.params;
    const address = await Address.findOneAndDelete({ _id: address_id });
    res.status(200).json({ message: "Address deleted successfully" });
});

// update address
const updateAddress = asyncWrapper(async (req, res, next) => {
    const user_id = req.user.id;
    const { address_id } = req.params;
    const address = await Address.findOneAndUpdate({ _id: address_id }, req.body, { new: true });
    res.status(200).json({ message: "Address deleted successfully" }, address);
});

export { getAddress, addAddress, updateAddress, removeAddress };
