import { Schema, model, Types } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide the name"],
            minlength: 3,
        },
        email: {
            type: String,
            required: [true, "Please provide the email"],
            validate: {
                validator: validator.isEmail,
                message: "Please provide valid email",
            },
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Please provide the password"],
            minlength: 6,
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
        wishlist: {
            type: [Types.ObjectId],
            ref: "Product",
        },
        mobile: {
            type: String,
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.comparePassword = async function (password) {
    const comparePassword = await bcrypt.compare(password, this.password);
    return comparePassword;
};

const User = model("User", userSchema);
export default User;
