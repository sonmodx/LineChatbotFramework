import mongoose from "mongoose";

const mapping_access_token_destination_schema = new mongoose.Schema({

    channel_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
        required: true,
    },
    api_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "API",
        required: true,
    },
    action_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Action",
        required: true,
    },
    access_token: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const mapping_access_token_destination = mongoose.models.mapping_access_token_destination || mongoose.model("mapping_access_token_destination", mapping_access_token_destination_schema);
export default mapping_access_token_destination;