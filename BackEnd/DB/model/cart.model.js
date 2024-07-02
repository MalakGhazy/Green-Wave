import mongoose from 'mongoose';

const { Schema, Types } = mongoose;

const cartSchema = new Schema({
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            productId: { type: Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true, default: 1 }
        }
    ]
}, {
    timestamps: true
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
