
import { Router } from "express";
import * as categoryController from "./category.controller.js"
import { auth } from "../../middleware/auth.js";

const router=Router()

router.post('/add-category',auth(),categoryController.addCategory)

router.put('/update/:categoryId',auth(),categoryController.updateCategory)

router.delete('/delete/:categoryId',auth(),categoryController.DeleteCategory)

router.get('/getbyid/:categoryId',categoryController.getById)

router.get('/search/:searchkey',categoryController.SearchByName)

router.get('/getall',categoryController.getAllCategories)


export default router 
