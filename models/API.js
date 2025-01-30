import mongoose, { Schema, models } from "mongoose";

const APISchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    method_type: {
      type: String,
      required: true,
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
    api_params: [
      {
        key: {
          type: String,
          required: false,
        },
        value: {
          type: String,
          required: false,
        },
        description: {
          type: String,
          required: false,
        },
      },
    ],
    api_headers: [
      {
        key: {
          type: String,
          required: false,
        },
        value: {
          type: String,
          required: false,
        },
        description: {
          type: String,
          required: false,
        },
      },
    ],
    api_body: [
      {
        key: {
          type: String,
          required: false,
        },
        content_type: {
          type: String,
          required: false,
        },
        content: {
          type: String,
          required: false,
        },
      },
    ],
    api_auth: {
      secret_token: {
        type: String,
        required: false,
      },
      type: {
        type: String,
        required: false,
      },
    },
    response: {
      type: String,
      required: false,
    },
    owner: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const API = models.API || mongoose.model("API", APISchema);
export default API;
