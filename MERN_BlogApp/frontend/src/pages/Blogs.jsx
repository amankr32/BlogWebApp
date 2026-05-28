import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { CardSkeleton } from '../components/SkeletonLoader';
import { Calendar, User, Hash } from 'lucide-react';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await API.get('/blogs');
        setBlogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 animate-fade-in">
      <div className="mb-12">
        <h2 className="font-sans text-3xl font-bold tracking-tight text-white mb-2">Engineering Stream</h2>
        <p className="text-saas-muted text-sm">Dispatches, theoretical reviews, and computational workflows from the network ecosystem.</p>
      </div>

      {loading ? (
        <div>{[1, 2, 3].map((n) => <CardSkeleton key={n} />)}</div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-saas-border rounded-xl text-saas-muted font-mono text-sm">
          No document packets indexed inside the primary operational cluster nodes.
        </div>
      ) : (
        <div className="space-y-10">
          {blogs.map((blog) => (
            <article key={blog._id} className="group relative border-b border-saas-border/60 pb-10 transition-all duration-300 last:border-0">
              <Link to={`/blog/${blog.slug}`} className="block">
                <div className="flex flex-col sm:flex-row gap-8 items-start justify-between">
                  <div className="flex-1 min-w-0 order-2 sm:order-1">
                    <div className="flex items-center gap-3 text-xs font-mono text-saas-muted mb-3">
                      <span className="flex items-center gap-1 text-gray-300">
                        <User size={12} /> {blog.author?.username || 'Core Operator'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {new Date(blog.createdAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                      </span>
                    </div>

                    <h3 className="font-sans text-2xl font-bold text-white group-hover:text-neutral-300 transition-colors duration-200 tracking-tight leading-snug mb-3">
                      {blog.title}
                    </h3>

                    <p className="text-saas-muted text-sm md:text-base font-sans line-clamp-2 leading-relaxed mb-4">
                      {blog.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {blog.tags?.map((t) => (
                        <span key={t} className="inline-flex items-center gap-0.5 bg-saas-surface border border-saas-border px-2 py-0.5 rounded text-xs font-mono text-gray-400 group-hover:border-zinc-700 duration-200">
                          <Hash size={10} />{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {blog.coverImage && (
                    <div className="w-full sm:w-44 h-28 rounded-lg overflow-hidden border border-saas-border bg-saas-surface shrink-0 order-1 sm:order-2 group-hover:border-neutral-700 duration-300">
                      <img 
                        src={blog.coverImage} 
                        alt="" 
                        className="w-full h-full object-cover filter grayscale contrast-[1.1] brightness-[0.85] group-hover:grayscale-0 group-hover:scale-105 group-hover:brightness-100 transition-all duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blogs;