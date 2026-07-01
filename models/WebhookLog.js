import mongoose from "mongoose";

const WebhookLogSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      index: true,
    },
    orderId: {
      type: String,
      index: true,
    },
    uniqueKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export default mongoose.models.WebhookLog || mongoose.model("WebhookLog", WebhookLogSchema);
