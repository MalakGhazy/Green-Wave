import { Router } from "express";
import * as brandController from "./brand.controller.js"
import { auth, roles } from "../../middleware/auth.js";

const router=Router()

router.post('/add',auth([roles.admin]),brandController.addBrand)

router.put('/update/:brandId',auth([roles.admin]),brandController.updateBrand)

router.delete('/delete/:brandId',auth([roles.admin]),brandController.DeleteBrand)

router.get('/search/:searchkey',brandController.SearchByName)

router.get('/getbyid/:brandId',brandController.getById)

router.get('/getall',brandController.getAllBrands)

export default router 