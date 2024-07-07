import { Router } from 'express';
import *as cartController from './cart.controller.js';
import { auth, roles } from '../../middleware/auth.js';

const router = Router();

router.post('/add',auth([roles.user]), cartController.addItemToCart);
router.delete('/remove/:itemId',auth([roles.user]),cartController.removeItemFromCart);
router.get('/getall',auth([roles.user]), cartController.getCartItems);

export default router;
