import { Router } from "express";
import * as authController from "./controller/registeration.js"
import { auth } from "../../middleware/auth.js";

const router = Router()

router.post('/signup',authController.signup)

router.patch('/confirm-email',authController.confirmEmail)

router.post('/signin',authController.signin)

router.patch('/send-code',authController.sendCode)

router.patch('/reset-pass',authController.resetPassword)

router.patch('/update',)

router.patch('/change-pass')

router.patch('/soft-del',auth(),authController.softDelete)


//logout
//refresh token 
export default router

