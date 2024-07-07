import { Router } from "express"
import * as wishlistController from "./wishlist.controller.js"
import { auth, roles } from "../../middleware/auth.js"

const router = Router()

router.patch('/add-product-wishlist/:productId',auth([roles.user]),wishlistController.addpPoductWishList)

router.patch('/add-book-wishlist/:bookId',auth([roles.user]),wishlistController.addBookWishList)

router.patch('/add-course-wishlist/:courseId',auth([roles.user]),wishlistController.addCourseWishList)

router.delete('/remove-product-wishlist/:productId',auth([roles.user]),wishlistController.removeProductWishList)

router.delete('/remove-book-wishlist/:bookId',auth([roles.user]),wishlistController.removeBookWishList)

router.delete('/remove-course-wishlist/:courseId',auth([roles.user]),wishlistController.removeCourseWishList)

router.get('/getwishlist',auth([roles.user]),wishlistController.getUserWishList)

export default router