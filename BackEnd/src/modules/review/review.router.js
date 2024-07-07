import { Router } from "express";
import * as reviewController from './review.controller.js'
import { auth, roles } from "../../middleware/auth.js";

const router =Router()

router.post('/add',auth([roles.user]),reviewController.addReview)

router.get('/getAll',auth([roles.user]),reviewController.getUserReviews)

router.put('/update/:reviewId',auth([roles.user]),reviewController.updateReview)

router.delete('/delete/:reviewId',auth([roles.user]),reviewController.deleteReview)

export default router

