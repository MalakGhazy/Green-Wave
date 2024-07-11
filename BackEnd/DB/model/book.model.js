import  { model, Schema, Types } from 'mongoose';

const bookSchema = new Schema({
    title: { type: String},
    author: { type: String,},
    genre: { type: String, },
    publishedDate: { type: Date,
        default: Date.now
    },
    price: { type: Number,
        default:0
    },
    stock:{
        type:Number
    },
    description: { type: String },
    coverImage: { type: Object  },
    createdBy: { type: Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const bookModel = model('Book', bookSchema);

export default bookModel;
