import mongoose from 'mongoose';

const { Schema, Types } = mongoose;

const productSchema = new Schema({
    name: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true, lowercase: true },
    stock: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    paymentPrice: { type: Number, required: true, default: 0 },
    image: { type: Array },
    categoryId: { type: Types.ObjectId, ref: 'Category', required: true },
    brandId: { type: Types.ObjectId, ref: 'Brand', required: true },
    avgRate: { type: Number, default: 0 },
    soldItems: { type: Number, default: 0 },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
