import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
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
  text_message: {
    type: [String],
    required: true,
  },
  list_user: {
    type: [String],
    required: true,
  },
  keyword: {
    type: [String],
    required: true,
  },
}, { timestamps: true });

const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);
export default Message;
