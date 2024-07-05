import { Router } from 'express';
import *as cartController from './cart.controller.js';
import { auth } from '../../middleware/auth.js';

const router = Router();

router.post('/add',auth(), cartController.addItemToCart);
router.delete('/remove/:itemId',auth(),cartController.removeItemFromCart);
router.get('/getall',auth(), cartController.getCartItems);

export default router;
