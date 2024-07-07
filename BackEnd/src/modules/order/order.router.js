import { Router } from 'express';
import * as orderController from './order.controller.js';
import { auth, roles } from '../../middleware/auth.js';

const router = Router();

router.post('/create-order',auth([roles.user]),orderController.createOrder);
router.get('/getall',auth([roles.user]),orderController.getUserOrders);
router.put('/status/:orderId',orderController.updateOrderStatus);
router.put('/cancel/:orderId',auth([roles.user]),orderController.cancelOrder);

export default router;
