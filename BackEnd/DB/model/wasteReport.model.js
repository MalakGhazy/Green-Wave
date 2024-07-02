import mongoose from 'mongoose';

const { Schema } = mongoose;

const wasteReportSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: {
            type: [Number],
            required: true  // Coordinates are required
        }
    },
    reportType: {
        type: String,
        enum: ['garbage', 'recyclable', 'hazardous'],
        required: true
    },
    description: String,
    createdAt: { type: Date, default: Date.now }
});

// Ensure the 2dsphere index for GeoJSON coordinates
wasteReportSchema.index({ location: '2dsphere' });

const WasteReport = mongoose.model('WasteReport', wasteReportSchema);

export default WasteReport;
