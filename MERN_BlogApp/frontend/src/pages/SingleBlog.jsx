import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { PostSkeleton } from '../components/SkeletonLoader';
import { Calendar, User, ArrowLeft, Hash } from 'lucide-react';

const SingleBlog = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await API.get(`/blogs/${slug}`);
        setBlog(data);
      } catch (err) {
        console.error(err);
      } {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) return <PostSkeleton />;
  if (!blog) return <div className="py-20 text-center text-sm font-mono text-red-400">Payload tracking reference fault. Record missing.</div>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 animate-fade-in">
      <Link to="/blogs" className="inline-flex items-center gap-1.5 text-xs font-mono text-saas-muted hover:text-white mb-10 transition-colors group">
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> BACK TO STREAM
      </Link>

      <header className="mb-10">
        <h1 className="font-sans text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-[1.15]">
          {blog.title}
        </h1>
        
        <div className="flex items-center gap-3 border-y border-saas-border py-4 my-6">
          <div className="w-9 h-9 rounded-full bg-zinc-900 border border-saas-border flex items-center justify-center font-bold text-xs text-white">
            {blog.author?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="text-xs font-mono">
            <div className="text-gray-200 font-sans font-medium text-sm flex items-center gap-1">
              <User size={12} className="text-saas-muted" /> {blog.author?.username || 'System Node'}
            </div>
            <div className="text-saas-muted flex items-center gap-1 mt-1">
              <Calendar size={11} /> {new Date(blog.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
      </header>

      {blog.coverImage && (
        <div className="w-full h-[320px] rounded-xl overflow-hidden border border-saas-border bg-saas-surface mb-10 shadow-premium">
          <img src={blog.coverImage} alt="" className="w-full h-full object-cover filter contrast-[1.05] brightness-90" />
        </div>
      )}

      {/* Render Workspace Content Markdown structure */}
      <div className="prose-content whitespace-pre-wrap selection:bg-saas-brand/30">
        {blog.content}
      </div>

      <footer className="mt-16 pt-6 border-t border-saas-border flex flex-wrap gap-2">
        {blog.tags?.map((t) => (
          <span key={t} className="inline-flex items-center gap-0.5 text-xs font-mono bg-saas-surface border border-saas-border text-gray-300 px-2.5 py-1 rounded-md">
            <Hash size={11} className="text-saas-muted" />{t}
          </span>
        ))}
      </footer>
    </div>
  );
};

export default SingleBlog;