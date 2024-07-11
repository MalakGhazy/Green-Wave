import { Router } from "express";
import * as reviewController from './review.controller.js'
import { auth, roles } from "../../middleware/auth.js";

const router =Router()

router.post('/add',auth(),reviewController.addReview)

router.get('/getAll',auth(),reviewController.getUserReviews)

router.put('/update/:reviewId',auth(),reviewController.updateReview)

router.delete('/delete/:reviewId',auth(),reviewController.deleteReview)

export default router

