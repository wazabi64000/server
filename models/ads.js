// server/models/ads.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const adsSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    images: [{
        type: String,
        required: false
    }],
    city: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    mainImage: {
        type: String,
        required: false
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "User"
    },
    zip_code: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    category: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Category"
    },

});

export default mongoose.model("Annonce", adsSchema);
