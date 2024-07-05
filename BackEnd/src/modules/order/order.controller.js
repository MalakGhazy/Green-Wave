import Order from '../../../DB/model/order.model.js';
import User from '../../../DB/model/user.model.js';
import Product from '../../../DB/model/product.model.js';

// Create a new order --> complete to checkout.
export const createOrder = async (req, res) => {
    try {
        const { userId, items } = req.body;
        
        // Calculate total amount
        let totalAmount = 0;
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
            }
            totalAmount += product.price * item.quantity;
        }
        
        // Create the order
        const order = new Order({
            userId,
            items,
            totalAmount
        });
        await order.save();

        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all orders for a user (Order Hostory)
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ userId }).populate('items.productId');
        res.status(200).json(orders);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update order status --> Tracking
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
