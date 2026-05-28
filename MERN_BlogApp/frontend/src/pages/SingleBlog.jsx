import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import toast from 'react-hot-toast';
import { Heart, MessageSquare, Send, User, Calendar } from 'lucide-react';

const SingleBlog = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [likeState, setLikeState] = useState({ count: 0, hasLiked: false });

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const { data } = await API.get(`/blogs/${slug}`);
        setBlog(data);
        
        // Match active logged-in account ID parameters across backend schema array metrics
        const currentUserId = user?._id || user?.id;
        const alreadyLiked = currentUserId && Array.isArray(data.likes)
          ? data.likes.some(id => id.toString() === currentUserId.toString())
          : false;

        setLikeState({
          count: Array.isArray(data.likes) ? data.likes.length : 0,
          hasLiked: alreadyLiked
        });
      } catch (err) {
        toast.error("Telemetry resolution failure reading document.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogData();
  }, [slug, user]);

  const handleLikeToggle = async () => {
    if (!user) {
      toast.error("Authentication trace missing. Please login to like.");
      return navigate('/login');
    }

    try {
      const { data } = await API.put(`/blogs/${blog._id}/like`);
      
      // Calculate hasLiked dynamically from returned data.likes array metrics
      const currentUserId = user?._id || user?.id;
      const verifiedLikeState = currentUserId && Array.isArray(data.likes)
        ? data.likes.some(id => id.toString() === currentUserId.toString())
        : false;

      setLikeState({
        count: Array.isArray(data.likes) ? data.likes.length : 0,
        hasLiked: verifiedLikeState
      });
      
      // Keep the root blog document object in sync
      setBlog(prev => ({ ...prev, likes: data.likes }));
    } catch (err) {
      toast.error("Transaction write rejection matching like payload.");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Authentication trace missing. Please login to comment.");
      return navigate('/login');
    }
    if (!commentText.trim()) return;

    try {
      const { data } = await API.post(`/blogs/${blog._id}/comment`, { text: commentText.trim() });
      
      // FIX: Extract data.comments explicitly instead of passing the root payload object wrapper
      const updatedCommentsArray = Array.isArray(data.comments) ? data.comments : data;
      
      setBlog(prev => ({ ...prev, comments: updatedCommentsArray }));
      setCommentText('');
      toast.success("Comment tracking registry node initialized.");
    } catch (err) {
      toast.error("Write execution dropped on comment subdocument.");
    }
  };

  if (loading) return <div className="text-center font-mono text-xs text-zinc-500 py-24">Processing Segment Array Data...</div>;
  if (!blog) return <div className="text-center font-mono text-xs text-red-400 py-24">Specification Node Offline.</div>;

  // Defensive execution matrix ensuring comments variable parses down as a clean iterable array
  const activeComments = Array.isArray(blog.comments) ? blog.comments : [];

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-white font-sans">
      {/* Header Element */}
      <div className="space-y-6 mb-8">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">{blog.title}</h1>
        <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 border-b border-zinc-900 pb-6">
          <div className="flex items-center gap-1.5 text-saas-brand">
            <User size={14} /> @{blog.author?.username || 'System Node'}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={14} /> {new Date(blog.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Main Narrative Display Area */}
      <article className="prose prose-invert max-w-none text-zinc-300 text-lg leading-relaxed font-serif mb-12 white-space-pre-line">
        {blog.content}
      </article>

      {/* Action Engagement Interface Container */}
      <div className="border-y border-zinc-900 py-4 flex items-center gap-6 mb-12 font-mono text-xs">
        <button 
          onClick={handleLikeToggle}
          className={`flex items-center gap-2 transition-colors duration-200 ${
            likeState.hasLiked ? 'text-rose-500 font-bold' : 'text-zinc-500 hover:text-rose-400'
          }`}
        >
          <Heart size={18} fill={likeState.hasLiked ? 'currentColor' : 'none'} />
          <span>{likeState.count} Matrix Approvals</span>
        </button>
        <div className="flex items-center gap-2 text-zinc-500">
          <MessageSquare size={18} />
          <span>{activeComments.length} Telemetry Notes</span>
        </div>
      </div>

      {/* Comments Section Component */}
      <div className="space-y-8">
        <h3 className="text-sm font-mono tracking-widest text-zinc-400 uppercase">Comments Array Log</h3>

        {/* Form Entry */}
        <form onSubmit={handleCommentSubmit} className="flex gap-4 items-end bg-zinc-950 border border-zinc-900 rounded-xl p-4">
          <textarea 
            required
            rows={2}
            placeholder="Type comment spec sequence..."
            className="flex-grow bg-transparent text-sm text-zinc-300 placeholder-zinc-700 resize-none focus:outline-none"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button type="submit" className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-saas-brand transition-colors">
            <Send size={14} />
          </button>
        </form>

        {/* Display Comments List */}
        <div className="space-y-4">
          {activeComments.length === 0 ? (
            <p className="text-zinc-600 font-serif italic text-xs py-2">No commentary strings registered.</p>
          ) : (
            activeComments.map((comment) => (
              <div key={comment._id || comment.id} className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                  {/* FIX: Swapped out comment.author for comment.user to sync to backend schemas */}
                  <span className="text-zinc-400 font-bold">
                    @{comment.user?.username || 'anonymous_node'}
                  </span>
                  <span>{comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Just now'}</span>
                </div>
                <p className="text-sm text-zinc-300 font-sans">{comment.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;