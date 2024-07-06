import { Router } from "express";
import * as couponRouter from './coupon.controller.js'
import { auth } from "../../middleware/auth.js";

const router= Router()

router.post('/create',auth(),couponRouter.addCoupon)

export default router

