import { model,Schema, Types } from 'mongoose';


const cartSchema = new Schema({
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            productId: { type: Types.ObjectId, ref: 'Product',required: false },
            bookId : {type :Types.ObjectId,ref:'Book',required: false },
            courseId : {type :Types.ObjectId,ref:'Course',required: false },
            quantity: { type: Number, default: 1,required: true  }
        }
    ]
}, {
    timestamps: true
});

export const cartModel = model('Cart', cartSchema);

export default cartModel;
