import mongoose from 'mongoose';


const ActionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  channel_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
  },
  api_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'API',
  },
  message: {
    type: [mongoose.Schema.Types.Mixed],// any type
    required: true,
  },
  keyword: {
    type: [String],
    required: true,
  },
}, { timestamps: true });

const Action = mongoose.models.Action || mongoose.model('Action', ActionSchema);
export default Action;
