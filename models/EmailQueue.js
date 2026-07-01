import mongoose from "mongoose";

const EmailQueueSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: [true, "Order ID is required"],
      index: true,
    },
    customerEmail: {
      type: String,
      required: [true, "Customer email is required"],
      trim: true,
      lowercase: true,
      index: true,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
    },
    html: {
      type: String,
      required: [true, "HTML body is required"],
    },
    attempts: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
      index: true,
    },
    lastError: {
      type: String,
    },
    processing: {
      type: Boolean,
      default: false,
      index: true,
    },
    processingAt: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.EmailQueue || mongoose.model("EmailQueue", EmailQueueSchema);
