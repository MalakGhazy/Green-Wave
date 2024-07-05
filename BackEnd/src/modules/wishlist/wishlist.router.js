import { Router } from "express"
import * as wishlistController from "./wishlist.controller.js"
import { auth } from "../../middleware/auth.js"

const router = Router()

router.patch('/add-product-wishlist/:productId',auth(),wishlistController.addpPoductWishList)

router.patch('/add-book-wishlist/:bookId',auth(),wishlistController.addBookWishList)

router.patch('/add-course-wishlist/:courseId',auth(),wishlistController.addCourseWishList)

router.delete('/remove-product-wishlist/:productId',auth(),wishlistController.removeProductWishList)

router.delete('/remove-book-wishlist/:bookId',auth(),wishlistController.removeBookWishList)

router.delete('/remove-course-wishlist/:courseId',auth(),wishlistController.removeCourseWishList)

router.get('/getwishlist',auth(),wishlistController.getUserWishList)

export default router