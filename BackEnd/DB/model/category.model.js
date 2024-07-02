import mongoose from 'mongoose';

const { Schema, Types } = mongoose;

const categorySchema = new Schema({
    name: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true, lowercase: true },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
});

const Category = mongoose.model('Category', categorySchema);

export default Category;

