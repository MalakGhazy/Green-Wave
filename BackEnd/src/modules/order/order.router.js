import { Router } from 'express';
import { createOrder, getUserOrders, updateOrderStatus } from './order.controller.js';

const router = Router();

router.post('/order', createOrder);
router.get('/orders/:userId', getUserOrders);
router.put('/order/:orderId/status', updateOrderStatus);

export default router;
