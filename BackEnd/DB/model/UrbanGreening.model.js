import mongoose from 'mongoose';

const urbanGreeningSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    location: {
        type: String,
        required: true
    },
    requestDetails: {
        type: String,
        required: true
    },
    // Add other fields as necessary
}, {
    timestamps: true
});

const UrbanGreening = mongoose.model('UrbanGreening', urbanGreeningSchema);
export default UrbanGreening;
