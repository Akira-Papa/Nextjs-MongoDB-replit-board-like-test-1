import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Like'
    }],
    default: [],
  },
});

export const Like = mongoose.models.Like || mongoose.model('Like', likeSchema);
export const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
