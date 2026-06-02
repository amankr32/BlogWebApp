import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { blogAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useReadingProgress, useCopyToClipboard } from "../hooks";
import BlogCard from "../components/blog/BlogCard";
import { PostSkeleton } from "../components/ui/Skeletons";
import toast from "react-hot-toast";
import {
  Heart,
  MessageSquare,
  Bookmark,
  Clock,
  Eye,
  Twitter,
  Link as LinkIcon,
  ChevronLeft,
  Send,
  Trash2,
  Check,
  User,
  Hash,
} from "lucide-react";
import {
  formatDate,
  formatRelativeDate,
  formatNumber,
  getCategoryStyle,
} from "../utils";

const CommentItem = ({ comment, currentUser, onDelete }) => {
  const name = comment.user?.name || comment.user?.username || "Anonymous";
  const avatar =
    comment.user?.avatar ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;
  const canDel =
    currentUser &&
    (currentUser._id === comment.user?._id || currentUser.role === "admin");

  return (
    <div className="flex gap-3 group">
      <img
        src={avatar}
        alt={name}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-0.5 ring-1 ring-[--color-border]"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <span className="text-sm font-semibold text-white">{name}</span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[--color-text-muted] font-mono">
              {formatRelativeDate(comment.createdAt)}
            </span>
            {canDel && (
              <button
                onClick={() => onDelete(comment._id)}
                className="opacity-0 group-hover:opacity-100 text-[--color-text-muted] hover:text-red-400 transition-all"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        </div>
        <p className="text-sm text-[--color-text-secondary] leading-relaxed">
          {comment.text}
        </p>
      </div>
    </div>
  );
};

const SingleBlog = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const progress = useReadingProgress();
  const { copied, copy } = useCopyToClipboard();

  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentLoad, setCommentLoad] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await blogAPI.getBySlug(slug);
        setBlog(data.data);
        setRelated(data.related || []);
        setLikesCount(data.data.likes?.length || 0);
        if (user) {
          setLiked(data.data.likes?.some((id) => id.toString() === user._id));
          setBookmarked(
            data.data.bookmarks?.some((id) => id.toString() === user._id),
          );
        }
      } catch {
        toast.error("Article not found");
        navigate("/blogs");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug, user, navigate]);

  const handleLike = async () => {
    if (!user) {
      toast.error("Sign in to like articles");
      navigate("/login");
      return;
    }
    try {
      const { data } = await blogAPI.like(blog._id);
      setLiked(!liked);
      setLikesCount(data.likesCount);
    } catch {
      toast.error("Failed to update like");
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast.error("Sign in to bookmark");
      navigate("/login");
      return;
    }
    try {
      const { data } = await blogAPI.bookmark(blog._id);
      setBookmarked(data.bookmarked);
      toast.success(data.bookmarked ? "Bookmarked!" : "Bookmark removed");
    } catch {
      toast.error("Failed to update bookmark");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Sign in to comment");
      navigate("/login");
      return;
    }
    if (!commentText.trim()) return;
    setCommentLoad(true);
    try {
      const { data } = await blogAPI.addComment(blog._id, {
        text: commentText.trim(),
      });
      setBlog((prev) => ({ ...prev, comments: data.comments }));
      setCommentText("");
      toast.success("Comment posted!");
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setCommentLoad(false);
    }
  };

  const handleDeleteComment = async (cid) => {
    try {
      await blogAPI.deleteComment(blog._id, cid);
      setBlog((prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c._id !== cid),
      }));
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  if (loading)
    return (
      <div className="container-page">
        <PostSkeleton />
      </div>
    );
  if (!blog) return null;

  const authorName = blog.author?.name || blog.author?.username || "Anonymous";
  const authorAvatar =
    blog.author?.avatar ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${authorName}`;
  const comments = Array.isArray(blog.comments) ? blog.comments : [];
  const { dot, label } = getCategoryStyle(blog.category);

  return (
    <>
      {/* Reading progress */}
      <div
        className="fixed top-0 left-0 z-[100] h-[2px] bg-gradient-to-r from-[--color-brand] to-[--color-accent] transition-all duration-75"
        style={{ width: `${progress}%` }}
      />

      <div className="min-h-screen">
        <div className="container-page py-10">
          <div className="grid lg:grid-cols-[1fr_260px] gap-14">
            {/* ── Main ── */}
            <article className="min-w-0">
              <button
                onClick={() => navigate(-1)}
                className="btn-ghost gap-2 -ml-2 mb-8"
              >
                <ChevronLeft size={15} /> Back
              </button>

              {/* Category */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider ${label}`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: dot }}
                  />
                  {blog.category}
                </span>
                <span className="text-xs text-[--color-text-muted] font-mono flex items-center gap-1">
                  <Clock size={11} /> {blog.readTime} min read
                </span>
                <span className="text-xs text-[--color-text-muted] font-mono flex items-center gap-1">
                  <Eye size={11} /> {formatNumber(blog.views)} views
                </span>
              </div>

              {/* Title */}
              <h1 className="font-black text-3xl md:text-4xl lg:text-5xl text-white mb-6 leading-[1.1] tracking-tight">
                {blog.title}
              </h1>

              {/* Author */}
              <div className="flex items-center gap-4 pb-8 mb-8 border-b border-[--color-border]">
                <Link to={`/profile/${blog.author?.username}`}>
                  <img
                    src={authorAvatar}
                    alt={authorName}
                    className="w-11 h-11 rounded-full object-cover ring-1 ring-[--color-border-strong]"
                  />
                </Link>
                <div className="flex-1">
                  <Link
                    to={`/profile/${blog.author?.username}`}
                    className="font-bold text-white hover:text-[--color-brand-hover] transition-colors"
                  >
                    {authorName}
                  </Link>
                  {blog.author?.bio && (
                    <p className="text-xs text-[--color-text-muted] line-clamp-1 max-w-sm mt-0.5">
                      {blog.author.bio}
                    </p>
                  )}
                  <p className="text-xs text-[--color-text-muted] font-mono mt-0.5">
                    {formatDate(blog.createdAt)}
                  </p>
                </div>
                {user && user._id !== blog.author?._id && (
                  <button className="btn-secondary !py-1.5 !px-4 text-xs">
                    Follow
                  </button>
                )}
              </div>

              {/* Cover image */}
              {blog.coverImage && (
                <div className="mb-10 rounded-2xl overflow-hidden border border-[--color-border]">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full max-h-[480px] object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="prose-content whitespace-pre-wrap mb-10">
                {blog.content}
              </div>

              {/* Tags */}
              {blog.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 pb-8 mb-8 border-b border-[--color-border]">
                  {blog.tags.map((t) => (
                    <Link key={t} to={`/blogs?tag=${t}`} className="tag">
                      <Hash size={9} />
                      {t}
                    </Link>
                  ))}
                </div>
              )}

              {/* Engagement bar */}
              <div className="flex items-center gap-3 p-4 bg-[--color-surface] border border-[--color-border] rounded-xl mb-10">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    liked
                      ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      : "text-[--color-text-muted] hover:text-rose-400 hover:bg-rose-500/10 border border-transparent"
                  }`}
                >
                  <Heart size={15} fill={liked ? "currentColor" : "none"} />
                  {likesCount} {likesCount === 1 ? "Like" : "Likes"}
                </button>
                <button
                  onClick={handleBookmark}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    bookmarked
                      ? "bg-[--color-brand-dim] text-[--color-brand-hover] border border-[rgba(99,102,241,0.2)]"
                      : "text-[--color-text-muted] hover:text-[--color-brand-hover] hover:bg-[--color-brand-dim] border border-transparent"
                  }`}
                >
                  <Bookmark
                    size={15}
                    fill={bookmarked ? "currentColor" : "none"}
                  />
                  {bookmarked ? "Saved" : "Save"}
                </button>
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() =>
                      window.open(
                        `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`,
                        "_blank",
                      )
                    }
                    className="btn-ghost !p-2"
                  >
                    <Twitter size={15} />
                  </button>
                  <button
                    onClick={() => copy(window.location.href)}
                    className="btn-ghost !p-2"
                  >
                    {copied ? (
                      <Check size={15} className="text-green-400" />
                    ) : (
                      <LinkIcon size={15} />
                    )}
                  </button>
                </div>
              </div>

              {/* Author card */}
              <div className="card p-6 mb-12">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[--color-text-muted] mb-4">
                  Written by
                </p>
                <div className="flex items-start gap-4">
                  <Link to={`/profile/${blog.author?.username}`}>
                    <img
                      src={authorAvatar}
                      alt={authorName}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  </Link>
                  <div className="flex-1">
                    <Link
                      to={`/profile/${blog.author?.username}`}
                      className="font-bold text-white text-lg hover:text-[--color-brand-hover] transition-colors"
                    >
                      {authorName}
                    </Link>
                    <p className="text-sm text-[--color-text-muted] mt-1 mb-3">
                      {blog.author?.bio || "No bio yet."}
                    </p>
                    <span className="text-xs text-[--color-text-muted] font-mono">
                      {blog.author?.followers?.length || 0} followers
                    </span>
                  </div>
                  {user && user._id !== blog.author?._id && (
                    <button className="btn-secondary !py-2 !px-4 text-sm">
                      Follow
                    </button>
                  )}
                </div>
              </div>

              {/* Comments */}
              <div id="comments">
                <h2 className="text-2xl font-black text-white mb-6">
                  Comments{" "}
                  <span className="text-[--color-text-muted] font-mono text-base">
                    ({comments.length})
                  </span>
                </h2>

                <form onSubmit={handleComment} className="mb-8">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[--color-surface] border border-[--color-border] flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden">
                      {user ? (
                        <img
                          src={
                            user.avatar ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`
                          }
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={14} className="text-[--color-text-muted]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder={
                          user ? "Share your thoughts…" : "Sign in to comment…"
                        }
                        disabled={!user}
                        rows={3}
                        className="input resize-none mb-2 !font-sans"
                      />
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={!user || !commentText.trim() || commentLoad}
                          className="btn-primary !py-1.5 !px-4 text-sm gap-2"
                        >
                          <Send size={13} />
                          {commentLoad ? "Posting…" : "Post Comment"}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                <div className="space-y-5">
                  {comments.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-[--color-border] rounded-2xl">
                      <MessageSquare
                        size={28}
                        className="mx-auto text-[--color-text-muted] mb-2 opacity-30"
                      />
                      <p className="text-sm text-[--color-text-muted]">
                        No comments yet. Be the first!
                      </p>
                    </div>
                  ) : (
                    comments.map((c) => (
                      <CommentItem
                        key={c._id}
                        comment={c}
                        currentUser={user}
                        onDelete={handleDeleteComment}
                      />
                    ))
                  )}
                </div>
              </div>
            </article>

            {/* ── Sidebar ── */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-5">
                <div className="card p-5">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[--color-text-muted] mb-4">
                    Stats
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Views", value: formatNumber(blog.views) },
                      { label: "Likes", value: formatNumber(likesCount) },
                      { label: "Comments", value: comments.length },
                      { label: "Min Read", value: blog.readTime },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="text-center p-3 bg-[--color-surface] rounded-xl border border-[--color-border]"
                      >
                        <div className="font-black text-xl text-white">
                          {value}
                        </div>
                        <div className="text-[10px] text-[--color-text-muted] font-mono">
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {related.length > 0 && (
                  <div className="card p-5">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-[--color-text-muted] mb-4">
                      Related
                    </p>
                    <div className="space-y-4">
                      {related.map((r) => (
                        <Link
                          key={r._id}
                          to={`/blog/${r.slug}`}
                          className="flex gap-3 group"
                        >
                          {r.coverImage && (
                            <img
                              src={r.coverImage}
                              alt={r.title}
                              className="w-12 h-10 rounded-lg object-cover flex-shrink-0 border border-[--color-border]"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-[--color-text-secondary] line-clamp-2 group-hover:text-white transition-colors">
                              {r.title}
                            </p>
                            <p className="text-[10px] text-[--color-text-muted] font-mono mt-0.5">
                              {r.readTime}m · {formatNumber(r.views)} views
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleBlog;
