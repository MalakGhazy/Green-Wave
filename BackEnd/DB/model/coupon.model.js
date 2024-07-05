import { model, Schema, Types } from "mongoose";

const couponSchema = new Schema({
    code:{type:String,required:true,unique:true,lowercase:true},
    amount : {type:Number,required:true,min:0,max:100},
    EXPDate:{type:Date,required:true,min:Date.now()},
    numofUses:{type:Number},
    createdBy:{type:Types.ObjectId,ref:'User',required:true},
    //to do after create user
    //UsedBy:[{ type: Types.ObjectId, ref: 'User', required: true }],
}
,
{
    timestamps:true,
}
)

export const couponModel = model('Coupon',couponSchema)
