import mongoose, { Schema, models } from "mongoose";

const logSchema = new Schema(
  {
    channel_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },
    chatbot_name: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    line_user_id: {
      type: Object,
      required: true,
    },
    content: {
      type: Object,
      required: true,
    },
    direction: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Log = models.Log || mongoose.model("Log", logSchema);
export default Log;
