import { Router } from "express";
import * as brandController from "./brand.controller.js"
import { auth } from "../../middleware/auth.js";

const router=Router()

router.post('/add',auth(),brandController.addBrand)

router.put('/update/:brandId',auth(),brandController.updateBrand)

router.delete('/delete/:brandId',auth(),brandController.DeleteBrand)

router.get('/search/:searchkey',brandController.SearchByName)

router.get('/getbyid/:brandId',brandController.getById)

router.get('/getall',brandController.getAllBrands)

export default router 