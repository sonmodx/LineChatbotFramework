import mongoose, { Schema, models } from "mongoose";

const channelSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    method_type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    api_endpoint: {
      type: String,
      required: true,
    },
    channel_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },
    api_params: [{
        key: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        }
    }],
    api_headers: [{
        key: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        }
    }],
    api_body: [{
        key: {
            type: String,
            required: true,
        },
        content_type: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: false,
        }
    },],
    api_auth: {
        secret_token: {
            type: String,
            required: false,
        },
        algorithm: {
            type: String,
            required: false,
        },
        payload: {
            type: String,
            required: false,
        },
    },
    keywords: [{
        type: String,
        required: false,
    }],
  },
  { timestamps: true }
);

const Channel = models.Channel || mongoose.model("Channel", channelSchema);
export default Channel;
