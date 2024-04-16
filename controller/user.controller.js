import User from '../model/user.model.js'
import asyncWrapper from '../middleware/asyncWrapper.middleware.js'
import ApiError from '../utils/apiError.util.js'

import { createJwtToken } from '../utils/jwt.util.js'
import checkPermission from '../utils/checkPermission.util.js'
import Product from '../model/product.model.js'

// get all user
export const getAllUser = asyncWrapper(async (req, res, next) => {
    const user = await User.find({role: 'user'}).select('-password')
    res.status(200).json({
        success: true,
        user
    })
})

// get single user
export const getSingleUser = asyncWrapper(async (req, res, next) => {
    const id = req.params.id
    
    const user = await User.findOne({_id: id}).select('-password')
    if(!user){
        return next(new ApiError(400, 'User does not exist'))
    }
    const permission = checkPermission(req.user, user._id)
    if(!permission){
        return next(new ApiError(401, 'unauthorized access'))
    }
    res.status(200).json(user)
})

// show current user
export const showCurrentUser = asyncWrapper(async (req, res, next) => {
    res.status(200).json(req.user)
})

// update user
export const updateUser = asyncWrapper(async (req, res, next) => {
    const {name, email, mobile} = req.body
    
    const user = await User.findOne({_id: req.user.id}).select('-password')
    if (!user) {
        throw next(new ApiError(400, "User does not exist"))
    }
    if(name) {
        user.name = name
    }
    if(email) {
        user.email = email
    }
    if(mobile) {
        user.mobile = mobile
    }
    await user.save()

    // const token = createJwtToken(user._id)
 
    res.status(200).json({success: true, message: "updated successfully", user})
})

// update user password
export const updateUserPassword = asyncWrapper(async (req, res, next) => {
    const {oldPassword, newPassword} = req.body
    if(!oldPassword || !newPassword) {
        return next(new ApiError(400, 'required field missing'))
    }
    const user = await User.findOne({_id: req.user.id})
    const verifyPassword = await user.comparePassword(oldPassword)
    if(!verifyPassword){
        return next(new ApiError(400, 'password does not match'))
    }
    user.password = newPassword
    await user.save()
    res.status(200).json({success: true, message: 'Password changed'})
})

export const addWishlist = asyncWrapper(async (req, res, next) => {
    console.log(req.body)
   const user = await User.findOne({_id: req.user.id})
   if(user.wishlist.includes(req.body.product_id)) {
    const idx = user.wishlist.indexOf(req.body.product_id)
    user.wishlist.splice(idx,1)
   } else {
       user.wishlist.push(req.body.product_id)
   }
   await user.save()
   
   res.status(200).json({success: true, wishlist: user.wishlist})
})


export const getWishlist = asyncWrapper(async (req, res, next) => {
   const user = await User.findOne({_id: req.user.id}).populate('wishlist');
   const wishlistProducts = user.wishlist;
   res.status(200).json({success: true, wishlistProducts});
})
