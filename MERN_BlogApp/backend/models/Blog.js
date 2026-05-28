import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  coverImage: { type: String },
  tags: [{ type: String }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Likes tracked cleanly via an array of User ObjectIDs
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Nested subdocument array mapping structure
  comments: [commentSchema]
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;