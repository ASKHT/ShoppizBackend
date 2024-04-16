import {Schema, model, Types} from 'mongoose'

const productSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Please provide product name'],
      maxlength: [200, 'Name can not be more than 200 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
    },
    highlights: {
      type: [String],
      maxlength: [1000, 'Description can not be more than 1000 characters'],
    },
    description: {
      type: String,
      maxlength: [1000, 'Description can not be more than 1000 characters'],
    },
    image: {
      type: String,
      default: '/uploads/example.jpeg',
    },
    category: {
      type: String,
      required: [true, 'Please provide product category'],
      enum: ["T-Shirts", "Jacket", "Jeans", "Shirts", "Trackpants", "Sweatshirt"]
    },
    brand: {
      type: String,
      required: [true, 'Please provide brand'],
    },
    colors: {
      type: [String],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    quantity: {
      type: Number,
      required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReview: {
      type: Number,
      default: 0,
    },
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true}
  // { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// productSchema.virtual('reviews', {
//   ref: 'Review',
//   localField: '_id',
//   foreignField: 'product',
//   justOne: false,
// });

productSchema.pre('deleteOne',{document: true}, async function (next) {
  await this.model('Review').deleteMany({ product: this._id });
});

const Product = model('Product', productSchema);
export default Product