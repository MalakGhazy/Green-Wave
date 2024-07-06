import  { model, Schema, Types } from 'mongoose';

const bookSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    publishedDate: { type: Date,
        default: Date.now
    },
    price: { type: Number,
        default:0
    },
    description: { type: String },
    coverImage: { type: Object ,required:true },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const bookModel = model('Book', bookSchema);

export default bookModel;
