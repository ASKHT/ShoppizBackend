import ApiError from "../utils/apiError.util.js";
import { jwtVerify } from "../utils/jwt.util.js";

export const authentication = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    
    if (!token) {
        return next(new ApiError(401, "Unauthorized access"));
    }

    try {
        const { id, role } = jwtVerify(token);
        req.user = { id, role };
        next()
    } catch (error) {
        return next(new ApiError(401, "token expired"));
    }
};

export const authorizePermission = (...role) => {
    return (req, res, next) => {
        if (!role.includes(req.user.role)) {
            return next(new ApiError(403, "access forbidden"));
        }
        next();
    };
};
