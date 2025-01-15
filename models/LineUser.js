import mongoose, { Schema, models } from "mongoose";

// ยังไม่เสร็จ
const lineUserSchema = new Schema(
  {
    line_user_id: {
      type: String,
      required: true,
      unique: true,
    },
    display_name: {
      type: String,
      required: true,
    },
    status_message: {
      type: String,
      required: false,
    },
    pictureUrl: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    tags: {
      type: [String],
      required: false,
    },
    groups: {
      type: [String],
      required: false,
    },
    status: {
      type: String,
      required: false,
    },
    channel_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },
  },
  { timestamps: true }
);

const LineUser = models.LineUser || mongoose.model("LineUser", lineUserSchema);

export default LineUser;
