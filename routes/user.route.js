import express from 'express'
import { getAllUser, getSingleUser, showCurrentUser, updateUser, updateUserPassword, addWishlist, getWishlist } from '../controller/user.controller.js'
import {authentication, authorizePermission} from '../middleware/authentication.middleware.js'

const router = express.Router()

router.route('/').get(authentication,authorizePermission('admin'),getAllUser)
router.route('/showMe').get(authentication,showCurrentUser)
router.route('/updateUser').patch(authentication, updateUser)
router.route('/updateUserPassword').patch(authentication, updateUserPassword)
router.route('/wishlist')
    .get(authentication, getWishlist)
    .post(authentication, addWishlist)
router.route('/:id').get(authentication, getSingleUser)



export default router
