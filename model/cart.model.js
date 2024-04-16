import {Schema, model, Types} from 'mongoose'
import Product from './product.model.js'

export const singleCartItems = new Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: Types.ObjectId,
        ref: 'Product'
    }, 
    totalPrice: {
        type: Number,
        default: 0
    }
}, { _id: false })

const cartSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    cartItems: {
        type: [singleCartItems],
    },
    cartTotal: {
        type: Number,
        required: true,
        default: 0
    },
})

cartSchema.pre('save', async function (next) {
    try {
        let total = 0;
        for (const item of this.cartItems) {
            const product = await Product.findById(item.product);
            total += product.price * item.quantity;
            item.totalPrice = product.price * item.quantity;
        }
        this.cartTotal = total;
        next();
    } catch (error) {
        next(error);
    }
});

const Cart = model('Cart', cartSchema)
export default Cart
