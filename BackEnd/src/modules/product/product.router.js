import { Router } from 'express';
import {
    addProduct,
    updateProduct,
    deleteProduct,
    searchProduct,
    getProductById,
    getAllProducts
} from './product.controller.js';

const router = Router();

router.post('/product', addProduct);
router.put('/product/:productId', updateProduct);
router.delete('/product/:productId', deleteProduct);
router.get('/product/search', searchProduct);
router.get('/product/:productId', getProductById);
router.get('/products', getAllProducts);

export default router;
