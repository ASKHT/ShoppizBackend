import Review from '../model/review.model.js'
import Product from '../model/product.model.js'
import asyncWrapper from '../middleware/asyncWrapper.middleware.js'
import ApiError from '../utils/apiError.util.js'
import checkPermission from '../utils/checkPermission.util.js'


// get single product reviews
export const getProductReview = asyncWrapper(async (req, res, next) => {
    const productId = req.params.productId

    const productReviews = await Review.find({product: productId}).populate('user')
    res.status(200).json({count: productReviews.length, productReviews})
})

// create review
export const createReview = asyncWrapper(async (req, res, next) => {
    const {product, comment, rating} = req.body
    const validProduct = await Product.findOne({_id: product})
    if(!validProduct){
        return next(new ApiError(400, 'Product not found'))
    }
    
    const alreadySubmitted = await Review.findOne({product: product , user: req.user.id})
    if(alreadySubmitted) {
        return next(new ApiError(400, 'Product has been reviewed'))
    }
    req.body.user = req.user.id
    const review = await Review.create(req.body)
    res.status(200).json({success: true, review})
})

// get all reviews
// export const getAllReview = asyncWrapper(async (req, res, next) => {
//     const {product} = req.body
//     const review = await Review.find()
//         .populate({path: 'product', select:'name company'})
//         // .populate({path:'user', select: 'name'})

    
//     Review.getConsoled()
//     res.status(200).json({count: review.count, review})
// })

// get single review
// export const getReview = asyncWrapper(async (req, res, next) => {
//     const {id: reviewId} = req.params // aliasing id to reviewId
//     const review = await Review.findOne({_id: reviewId})
//     if(!review) {
//         return next(new ApiError(400, 'Review not found'))
//     }
//     res.status(200).json(review)
// })

// update review
// export const updateReview = asyncWrapper(async (req, res, next) => {
//     const {id: reviewId} = req.params
//     const {rating, title, comment} = req.body
//     const review = await Review.findOne({_id: reviewId})
//     if(!review) {
//         return next(new ApiError(400, 'Review not found'))
//     }
//     const validPermission = checkPermission(req.user, review.user)
//     if(!validPermission){
//         return next(new ApiError(401, "you cannot update review"))
//     }
//     review.rating = rating
//     review.title = title
//     review.comment = comment
//     await review.save()
//     res.status(200).json({success: true, message: 'review updated'})
// })

// delete review
// export const deleteReview = asyncWrapper(async (req, res, next) => {
//     const {id: reviewId} = req.params
//     const review = await Review.findOne({_id: reviewId})
//     if(!review) {
//         return next(new ApiError(400, 'Review not found'))
//     }
//     const validPermission = checkPermission(req.user, review.user)
//     if(!validPermission){
//         return next(new ApiError(401, "you cannot delete review"))
//     }
//     await review.deleteOne({_id: reviewId})
//     res.status(200).json({success: true, message: 'review deleted'})
// })


