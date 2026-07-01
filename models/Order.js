import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      sparse: true,
      index: { unique: true },
    },
    orderId: {
      type: String,
      unique: true,
      index: true,
      sparse: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
      index: true,
    },
    customerEmail: {
      type: String,
      required: [true, "Customer email is required"],
      trim: true,
      lowercase: true,
      index: true,
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      index: true,
    },
    state: {
      type: String,
      enum: ["pending", "processing", "ready", "failed"],
      default: "pending",
      index: true,
    },
    processed: {
      type: Boolean,
      default: false,
      index: true,
    },
    assignedAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    pricePaid: {
      type: Number,
    },
    payCurrency: {
      type: String,
      trim: true,
    },
    assignedUsername: {
      type: String,
      trim: true,
    },
    emailSent: {
      type: Boolean,
      default: false,
      index: true,
    },
    emailSentAt: {
      type: Date,
    },
    productSnapshot: {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      loginUrl: { type: String },
    },
  },
  {
    timestamps: true,
    collection: "Order",
  }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
