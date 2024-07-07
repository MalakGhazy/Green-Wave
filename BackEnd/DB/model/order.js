import { model, Schema, Types } from "mongoose"

const orderSchema = new Schema({
    userId:{
        type:Types.ObjectId,
        ref:'User',
        required:true
    },
    items:[{
        product:{
            productId: { type: Types.ObjectId, ref: 'Product',required: false },
            name:{type: String},
            price: { type: Number},
            paymentPrice: { type: Number},
            quantity:{
                type:Number,
                //required:true,
            },
        },
        book:{
            bookId:{type: Types.ObjectId, ref:'Book',required: false},
            title: { type: String},
            author: { type: String },
            genre: { type: String },
            price: {type: Number},
            quantity:{
                type:Number,
                //required:true,
            },
        },
        course:{
            courseId:{type: Types.ObjectId, ref:'Course',required: false},
            title: { type: String},
            price: { type: Number},
            quantity:{
                type:Number,
                //required:true,
            },
        },
    }],
    address:{
        type:String,
        required:true
    },
    phone:{
        type:String
    },
    note:{
        type:String
    },
    coupon:{
        type:Types.ObjectId,ref:'Coupon'
    },
    price:{
        type:Number,
        //required:true
    },
    paymentPrice:{
        type: Number,
        //required: true
    },
    paymentMethod:{
        type:String,
        enum:['Cash','Card'],
        default:'Cash'
    },
    status:{
        type: String,
        enum: ['pending', 'confirmed','placed','shipped', 'delivered', 'cancelled'],
        default: 'placed'
    },
    reason:{
        type: String,
    }

},{
    timestamps:true
}
);

const ordermodel = model('Order',orderSchema)

export default ordermodel
