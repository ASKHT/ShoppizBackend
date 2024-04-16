import User from "../model/user.model.js";
import asyncWrapper from "../middleware/asyncWrapper.middleware.js";
import ApiError from "../utils/apiError.util.js";
import { createJwtToken } from "../utils/jwt.util.js";

// register
export const register = asyncWrapper(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw next(new ApiError("400", "required field missing"));
    }

    const emailAlreadyExist = await User.findOne({ email });
    if (emailAlreadyExist) {
        return next(new ApiError("400", "email already exist"));
    }

    const user = await User.create(req.body);
    const token = createJwtToken({ id: user._id, role: user.role });
    user.password = undefined; // removing password before sending to frontend
    res.status(200).json({
        success: true,
        message: "user registered successfully",
        user,
        token,
    });
});

// login
export const login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ApiError(400, "required field missing"));
    }

    const user = await User.findOne({ email });
    if (!user) {
        return next(new ApiError(400, "invalid credentials"));
    }
    const verifyPassword = await user.comparePassword(password);
    if (!verifyPassword) {
        return next(new ApiError(400, "invalid credentials"));
    }

    const token = createJwtToken({ id: user._id, role: user.role });
    user.password = undefined;
    res.status(200).json({
        success: true,
        message: "login successful",
        user,
        token,
    });
});

// logout
// export const logout = asyncWrapper(async (req, res) => {
//     res.cookie('refreshToken', undefined, {
//         expires: new Date(Date.now())
//     })
//     res.status(200).json({
//         success: true,
//         message: 'logout successful'
//     })
// })

