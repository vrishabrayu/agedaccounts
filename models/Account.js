import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
      index: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    status: {
      type: String,
      enum: ["AVAILABLE", "RESERVED", "SOLD", "DISABLED"],
      default: "AVAILABLE",
      index: true,
    },
    soldTo: {
      type: String,
      trim: true,
      lowercase: true,
    },
    soldAt: {
      type: Date,
    },
    reservedAt: {
      type: Date,
      index: true,
    },
    reservationExpiresAt: {
      type: Date,
      index: true,
    },
    orderId: {
      type: String,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "Credential",
  }
);

// Compound index for atomic stock lookups (including checking for available or expired reservations)
AccountSchema.index({ productId: 1, status: 1 });

export default mongoose.models.Account || mongoose.model("Account", AccountSchema);
