import mongoose from 'mongoose';

const { Schema, Types } = mongoose;

const courseSchema = new Schema({
    title: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true, lowercase: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true, default: 0 },
    instructor: { type: Types.ObjectId, ref: 'User', required: true },
    category: { type: Types.ObjectId, ref: 'Category', required: true },
    image: { type: String, required: true },
    rating: { type: Number, default: 0 },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
});

const courseModel = mongoose.model('Course', courseSchema);

export default courseModel;
