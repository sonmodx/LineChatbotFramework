import mongoose, { Schema, models } from "mongoose";

const channelSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    webhook_url: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    channel_id: {
      type: String,
      required: true,
      unique: true,
    },
    channel_secret: {
      type: String,
      required: true,
    },
    channel_access_token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Channel = models.Channel || mongoose.model("Channel", channelSchema);
export default Channel;
