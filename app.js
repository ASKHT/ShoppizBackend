import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";

// middleware
import errorMiddleware from "./middleware/error.middleware.js";
import notFound from "./middleware/notFound.middleware.js";

// routes
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import productRoute from "./routes/product.routes.js";
import reviewRoute from "./routes/review.route.js";
import cartRoute from "./routes/cart.route.js";
import orderRoute from "./routes/order.route.js";
import addressRoute from "./routes/address.route.js";
import paymentRoute from "./routes/payment.route.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/address", addressRoute);
app.use("/api/v1/payment", paymentRoute);

app.use(notFound);
app.use(errorMiddleware);

export default app;
