import { Router } from "express";
import * as authController from "./controller/registeration.js"
import { auth, roles } from "../../middleware/auth.js";

const router = Router()

router.post('/signup',authController.signup)

router.patch('/confirm-email',authController.confirmEmail)

router.post('/signin',authController.signin)

router.patch('/send-code',authController.sendCode)

router.patch('/reset-pass',authController.resetPassword)

router.patch('/update',auth([roles.user]),authController.UpdateUser)

router.patch('/change-pass',auth([roles.user]),authController.changePass)

router.patch('/soft-del',auth([roles.user]),authController.softDelete)

router.post('/logout',auth([auth.user]),authController.logout)

export default router

