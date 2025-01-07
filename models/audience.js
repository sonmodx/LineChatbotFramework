import mongoose, { Schema, models } from "mongoose";

const audienceSchema = new Schema(
  {
    channel_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },
    audienceGroupId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isIfaAudience: {
      type: Boolean,
      required: true,
    },
    uploadDescription: {
      type: String,
    },
    audiences: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

const Audience = models.Audience || mongoose.model("Audience", audienceSchema);
export default Audience;
