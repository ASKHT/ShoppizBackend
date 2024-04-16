import Product from '../model/product.model.js'
import asyncWrapper from '../middleware/asyncWrapper.middleware.js'
import ApiError from '../utils/apiError.util.js'

// get all product
export const getAllProducts = asyncWrapper(async (req, res, next) => {
    const query = req.query
    let filterQuery = {}
    let sortParam = null

    if(query.brands) {
        const brandArray = query.brands.split(',')
        console.log(brandArray);
        filterQuery = {...filterQuery, brand: {$in: brandArray}}
    }
    if(query.min_price || query.max_price) {
        filterQuery = {...filterQuery, price: {$gte: query.min_price, $lte: query.max_price}}
    }
    if(query.rating) {
        filterQuery = {...filterQuery, averageRating: {$gte: query.rating}}
    }
    
    if(query.sort) {
        switch(query.sort) {
            case 'lowtohigh': sortParam = 'price'
                              break;
            case 'hightolow': sortParam = '-price'
                              break;
            case 'rating': sortParam = '-rating'
                           break;
            default: sortParam = '-createdAt'
                    break;
        }
    }
    
    
    const products = await Product.find({category: req.params.category, ...filterQuery}).select('name price averageRating numOfReview brand image quantity').sort(sortParam)
    res.status(200).json({count: products.length, products})
})

// get single product
export const getSingleProduct = asyncWrapper(async (req, res, next) => {
    const productID = req.params.id
    const product = await Product.findOne({_id: productID})
    if(!product) {
        return next(new ApiError(400, 'product not found'))
    }
    res.status(200).json(product)
})

// create product
export const createProduct = asyncWrapper(async (req, res, next) => {
    console.log(req)
    req.body.user = req.user.id
    const product = await Product.create(req.body)
    res.status(200).json({
        success: true,
        product
    })
})

// update product
export const updateProduct = asyncWrapper(async (req, res, next) => {
    res.send('updateProduct')
})

// delete product
export const deleteProduct = asyncWrapper(async (req, res, next) => {
    const productID = req.params.id;
    const product = await Product.findOne({ _id: productID });
    if(!product){
        return next(new ApiError(400, 'product not found'))
    }
    await product.deleteOne();
    res.status(200).json({ msg: "Success! Product Removed" });

})


// uplaod image
export const uploadImage = asyncWrapper(async (req, res, next) => {
    res.send('uploadImage')
})