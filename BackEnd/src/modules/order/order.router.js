import { Router } from 'express';
import * as orderController from './order.controller.js';
import { auth } from '../../middleware/auth.js';

const router = Router();

router.post('/create-order',auth(),orderController.createOrder);
//router.get('/orders/:userId', getUserOrders);
//router.put('/order/:orderId/status', updateOrderStatus);

export default router;
