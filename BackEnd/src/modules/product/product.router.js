import { Router } from 'express';
import * as productController from './product.controller.js';
import { auth } from '../../middleware/auth.js';
import { fileUpload, fileValidation } from '../../utils/multer.js';

const router = Router();

router.post('/add', auth(),
fileUpload(fileValidation.image).single('image'),
productController.addProduct);

router.put('/update/:productId', productController.updateProduct);
router.delete('/delete/:productId', productController.deleteProduct);
router.get('/search/searchkey', productController.searchProduct);
router.get('/getbyid/:productId', productController.getProductById);
router.get('/getall', productController.getAllProducts);

export default router;
