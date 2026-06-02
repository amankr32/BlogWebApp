import mongoose from 'mongoose';
import slugify from 'slugify';

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, unique: true, index: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true, maxlength: 500 },
    coverImage: { type: String, default: '' },
    category: {
      type: String,
      enum: ['Technology', 'Programming', 'Design', 'Career', 'Tutorial', 'Opinion', 'News', 'Other'],
      default: 'Other',
    },
    tags: [{ type: String, trim: true, lowercase: true }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [commentSchema],
    views: { type: Number, default: 0 },
    readTime: { type: Number, default: 1 }, // minutes
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
    },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes for performance
blogSchema.index({ author: 1, createdAt: -1 });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ views: -1 });
blogSchema.index({ createdAt: -1 });
blogSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

// Auto-generate slug & readTime before save
blogSchema.pre('save', function (next) {
  if (this.isModified('title') || this.isNew) {
    const base = slugify(this.title, { lower: true, strict: true });
    this.slug = `${base}-${Date.now().toString(36)}`;
  }
  if (this.isModified('content') || this.isNew) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.max(1, Math.ceil(wordCount / 200));
  }
  next();
});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;