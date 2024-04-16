import {Schema, model, Types} from 'mongoose';

const reviewSchema = new Schema({
    rating: {
        type: Number,
        required: [true, 'Please provide the rating'],
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        default: ''
    },
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide the user']
    },
    product: {
        type: Types.ObjectId,
        ref: 'Product',
        required: [true, 'Please provide the product']
    }
}, {timestamps: true})

// for each product there will be only 1 review by any user
reviewSchema.index({product: 1, user: 1}, {unique: true})

// calculating average rating and number of review
reviewSchema.statics.calculateAverageRating = async function(productId) {
    const result = await this.aggregate([
        {$match: {product: productId}},
        {$group: {
            _id: null,
            averageRating: {$avg: '$rating'},
            numOfReview: {$sum: 1}
        }}
    ])
    console.log(result)
    try {
        await this.model('Product').findOneAndUpdate({_id: productId}, {
            averageRating: result[0]?.averageRating.toFixed(1) || 0,
            numOfReview: result[0]?.numOfReview || 0,
        })
    } catch (error) {
        console.log(error)
    }
}

reviewSchema.post('save', async function() {
    await this.constructor.calculateAverageRating(this.product)
})
reviewSchema.post('deleteOne', {document: true}, async function() {
    await this.constructor.calculateAverageRating(this.product)
})

const Review = model('Review', reviewSchema)
export default Review