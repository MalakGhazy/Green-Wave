import { Router } from 'express';
import * as orderController from './order.controller.js';
import { auth, roles } from '../../middleware/auth.js';

const router = Router();

router.post('/create-order',auth(),orderController.createOrder);
router.get('/getall',auth(),orderController.getUserOrders);
router.put('/status/:orderId',orderController.updateOrderStatus);
router.put('/cancel/:orderId',auth(),orderController.cancelOrder);

export default router;
