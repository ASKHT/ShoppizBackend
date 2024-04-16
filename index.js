import dotenv from "dotenv/config";
import Razorpay from "razorpay";

import connectDB from "./db/connectDB.js";
import app from "./app.js";

const port = process.env.PORT || 8000;

export const instance = new Razorpay({
    key_id: process.env.APP_RAZORPAY_KEY_ID,
    key_secret: process.env.APP_RAZORPAY_KEY_SECRET,
});

connectDB()
    .then(() => {
        console.log("Database connected");
        app.listen(port, () => {
            console.log(`Server running at port ${port}`);
        });
    })
    .catch((error) => console.log(error));
