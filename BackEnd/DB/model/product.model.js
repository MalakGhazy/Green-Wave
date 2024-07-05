import  { model , Schema, Types } from 'mongoose';

const productSchema = new Schema({
    name: { type: String, required: true, unique: true, lowercase: true },
    slug: { type: String, required: true ,unique:true,lowercase:true},
    description: { type: String, required: true, lowercase: true },
    stock: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    paymentPrice: { type: Number, default: 0 },
    image: { type: Object ,required:true },
    categoryId: { type: Types.ObjectId, ref: 'Category', required: true },
    brandId: { type: Types.ObjectId, ref: 'Brand', required: true },
    avgRate: { type: Number, default: 0 },
    soldItems: { type: Number, default: 0 },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    wishlist:[{
        type:Types.ObjectId,
        ref:'User'
    }]
}, 
{
    timestamps: true
});

const productModel = model('Product', productSchema);

export default productModel;
