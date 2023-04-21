import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const vitalSignsSchema = mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        trim: true
    },
    bodyTemperature: {
        type: String,
        required: true,
        trim: true
    },
    heartRate: {
        type: String,
        required: true,
        trim: true
    },
    bloodPressure: {
        type: String,
        required: true,
        trim: true
    },
    weight: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String,
        required: true,
        trim: true
    },
    userId:{
        type: String,
        required: true,
        trim: true
    }
});

const VitalSigns = mongoose.model('VitalSigns', vitalSignsSchema);

export default VitalSigns