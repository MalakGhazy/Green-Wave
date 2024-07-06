import mongoose, { Schema, Types } from "mongoose";

const wasteCollectionSchema = new Schema({
    userId:{
        type:Types.ObjectId,
        ref: 'User',
        required:true,
    },
    wasteType:{
        type:String,
        enum:['Plastic', 'Glass', 'Metal', 'Organic'],
        required:true,
    },
    amount:{
        type:Number,
        default : 1,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now(),
        required:true,
    },
    time:{
        type:String,
        enum : ['9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM'],
        default : '2:00 PM',
        required:true,
    },
},
{
    timestamps:true
}
)

const wasteCollectionModel = mongoose.model('WasteCollection',wasteCollectionSchema)

export default wasteCollectionModel;