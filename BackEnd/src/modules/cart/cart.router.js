import { Router } from 'express';
import {
    addItemToCart,
    updateCartItem,
    removeItemFromCart,
    getCartItems
} from './cart.controller.js';

const router = Router();

router.post('/cart/add', addItemToCart);
router.put('/cart/update', updateCartItem);
router.delete('/cart/remove', removeItemFromCart);
router.get('/cart/:userId', getCartItems);

export default router;
