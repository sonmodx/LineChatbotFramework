import mongoose, { Schema, models } from "mongoose";

const richmenuSchema = new Schema(
  {
    channel_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },
    richmenuId: {
      type: String,
      required: true,
    },
    richmenuAlias: {
      type: String,
      required: true,
    },
    content: {
      type: Object,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const RichMenu = models.RichMenu || mongoose.model("RichMenu", richmenuSchema);

export default RichMenu;
