import  { model, Schema,Types } from 'mongoose';

const ItemSchema = new Schema({
    itemType:{
        type:String,
        enum:['Product','Book','Course'],
        required:true
    },
    itemId:{type:Schema.Types.ObjectId,required:true},
    quantity:{
        type:Number,
        required:true,
        min:1
    },
    price:{
        type:Number,
        required:true
    }
});
const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        ItemSchema
    ],
    address:{type:String,required:true},
    phone:{type:String},
    notes:{type:String},
    coupon:{
        type:Types.ObjectId,ref:'Coupon'
    },
    price:{
        type:Number,
        //required:true
    },
    paymentPrice:{
        type:Number,
        //required:true
    },
    paymentMethod:{
        type:String,
        enum:['Cash','Card'],
        default:'Cash'
    },
    status: {
        type: String,
        /*
        enum: ['pending', 'shipped', 'placed', 'canceled', 'delivered', 'rejected', 'refunded'],
        default: 'placed',
        */
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const orderModel = model('Order', orderSchema);

export default orderModel;
