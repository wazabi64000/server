import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 64,
    },
    role: {
      type: String,
      default: "Geek",
    },
    image: {
      public_id: "",
      url: "",
    },
    resetCode: "",
    city: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      required: false,
      min: 10,
      max: 10,
      unique: true,
    },
    zip_code: {
      type: String,
      trim: true,
    },
    // Ajoutez des champs de géolocalisation si nécessaire
    location: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
  },
  { timestamps: true }
);

// Indiquez à MongoDB que le champ 'location' doit être traité comme une géolocalisation
userSchema.index({ location: "2dsphere" });

export default mongoose.model("User", userSchema);
