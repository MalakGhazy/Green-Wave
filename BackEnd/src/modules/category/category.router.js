import { Router } from 'express';
import {
    addCategory,
    updateCategory,
    deleteCategory,
    searchCategory,
    getCategoryById,
    getAllCategories
} from './category.controller.js';

const router = Router();

router.post('/category', addCategory);
router.put('/category/:categoryId', updateCategory);
router.delete('/category/:categoryId', deleteCategory);
router.get('/category/search', searchCategory);
router.get('/category/:categoryId', getCategoryById);
router.get('/categories', getAllCategories);

export default router;
