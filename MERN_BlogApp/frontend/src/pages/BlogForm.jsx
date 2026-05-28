import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';
import { Paperclip, Sparkles, Layout } from 'lucide-react';

const BlogForm = ({ isEdit }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', excerpt: '', content: '', coverImage: '', tags: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      const initForm = async () => {
        try {
          const { data } = await API.get('/blogs');
          const post = data.find(b => b._id === id);
          if (post) {
            setFormData({
              title: post.title,
              excerpt: post.excerpt,
              content: post.content,
              coverImage: post.coverImage || '',
              tags: post.tags?.join(', ') || ''
            });
          }
        } catch (err) {
          toast.error("Asset matrix recovery failure.");
        }
      };
      initForm();
    }
  }, [id, isEdit]);

  const handlePublish = async (e) => {
    e.preventDefault();
    setSubmitting(false); // Controlled tracking flag toggled below
    setSubmitting(true);

    // 1. Build a clean payload and sanitize the tags array matrix
    const cleanedPayload = {
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    // 2. CRITICAL FIX: Only include coverImage if it actually contains a typed string value.
    // This allows Mongoose to safely fall back to its Unsplash default value if empty!
    if (formData.coverImage && formData.coverImage.trim() !== '') {
      cleanedPayload.coverImage = formData.coverImage.trim();
    }

    try {
      if (isEdit) {
        await API.put(`/blogs/${id}`, cleanedPayload);
        toast.success("Document tracking schema shifted.");
      } else {
        await API.post('/blogs', cleanedPayload);
        toast.success("Document committed to remote index.");
      }
      navigate('/dashboard');
    } catch (err) {
      // 3. ENHANCED LOGGING: If the backend still objects, look at your browser DevTools Console
      // to read the exact parameter error string returned by MongoDB.
      console.error("❌ Database Transaction Error Trace:", err.response?.data);
      
      const serverMessage = err.response?.data?.message;
      toast.error(serverMessage || "Transactional write operation rejected.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 animate-fade-in">
      <div className="flex items-center gap-2 text-xs font-mono text-saas-brand uppercase tracking-widest mb-4">
        <Sparkles size={12} /> Composition Terminal Active
      </div>
      
      <form onSubmit={handlePublish} className="space-y-8">
        <div>
          <input 
            type="text" required placeholder="Untitled Draft Specification"
            className="w-full bg-transparent font-sans text-4xl md:text-5xl font-bold text-white placeholder-zinc-800 border-none focus:outline-none tracking-tight pb-2"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="space-y-4 font-mono text-xs">
          <div className="flex items-center gap-2 bg-saas-surface border border-saas-border rounded-lg px-3 py-2">
            <Paperclip size={14} className="text-zinc-600" />
            <input 
              type="url" placeholder="Cover Image Asset URL Link (Leave blank for default image)"
              className="w-full bg-transparent text-sm font-sans text-white focus:outline-none placeholder-zinc-600"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2 bg-saas-surface border border-saas-border rounded-lg px-3 py-2">
            <Layout size={14} className="text-zinc-600" />
            <input 
              type="text" placeholder="Tags array matrix tracking (separated by commas)"
              className="w-full bg-transparent text-sm font-sans text-white focus:outline-none placeholder-zinc-600"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <textarea 
            required placeholder="Enter dynamic asset summary abstraction context..."
            rows={2} 
            className="w-full bg-saas-surface/50 border border-saas-border rounded-lg p-4 text-sm font-sans text-gray-300 focus:outline-none focus:border-zinc-700 placeholder-zinc-600 transition-colors duration-200 resize-none"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          />

          <textarea 
            required placeholder="Begin rendering architectural analysis strings..."
            rows={14} 
            className="w-full bg-transparent font-serif text-lg text-gray-200 leading-relaxed focus:outline-none placeholder-zinc-800 resize-y"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
        </div>

        <div className="border-t border-saas-border pt-6 flex justify-end">
          <button 
            type="submit" disabled={submitting}
            className="btn-premium font-sans"
          >
            {submitting ? 'Executing Write Transaction...' : 'Commit Operational State'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;