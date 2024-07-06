import { model, Schema, Types } from "mongoose";

const reviewSchema = new Schema({
    userId:{
        type:Types.ObjectId,
        ref:'User',
        required:true
    },
        productId:{
            type:Types.ObjectId,
            ref:'Product',
            required:false
        },
        bookId:{
            type:Types.ObjectId,
            ref:'Book',
            required:false
        },
        courseId:{
            type:Types.ObjectId,
            ref:'Course',
            required:false
        },
        articleId:{
            type:Types.ObjectId,
            ref:'Article',
            required:false
        },
    comment:{
        type:String,
        required:true,
    },
},
{
    timestamps:true
});

export const reviewModel = model('Review',reviewSchema)

export default reviewModel