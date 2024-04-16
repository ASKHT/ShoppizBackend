import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.APP_CLOUDINARY_NAME,
    api_key: process.env.APP_CLOUDINARY_KEY,
    api_secret: process.env.APP_CLOUDINARY_SECRET,
});

export default cloudinary