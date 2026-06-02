import { Link } from "react-router-dom";
import { Clock, Eye, Heart, MessageSquare, Hash } from "lucide-react";
import { formatDate, formatNumber, getCategoryStyle } from "../../utils";

// Shared stat pill
const Stat = ({ icon: Icon, value }) => (
  <span className="flex items-center gap-1 text-[--color-text-muted] text-xs font-mono">
    <Icon size={11} /> {value}
  </span>
);

// ── Default card (grid view) ──────────────────────────────────────────────
const DefaultCard = ({ blog }) => {
  const {
    title,
    slug,
    excerpt,
    coverImage,
    author,
    category,
    tags = [],
    likes = [],
    views = 0,
    comments = [],
    readTime = 1,
    createdAt,
  } = blog;
  const name = author?.name || author?.username || "Anonymous";
  const avatar =
    author?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;
  const { dot, label } = getCategoryStyle(category);

  return (
    <div className="card card-hover p-0 overflow-hidden flex flex-col group">
      {/* Cover image */}
      {coverImage && (
        <div className="h-44 overflow-hidden bg-[--color-surface]">
          <img
            src={coverImage}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
          />
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Author + date */}
        <div className="flex items-center gap-2.5 mb-4">
          <Link to={`/profile/${author?.username}`}>
            <img
              src={avatar}
              alt={name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-[--color-border]"
            />
          </Link>
          <div className="flex-1 min-w-0">
            <Link
              to={`/profile/${author?.username}`}
              className="text-xs font-semibold text-[--color-text-secondary] hover:text-white transition-colors truncate block"
            >
              {name}
            </Link>
            <p className="text-[10px] text-[--color-text-muted] font-mono">
              {formatDate(createdAt)}
            </p>
          </div>
          {/* Category dot badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wider ${label}`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: dot }}
            />
            {category}
          </span>
        </div>

        {/* Title + excerpt */}
        <Link to={`/blog/${slug}`} className="flex-1">
          <h3 className="font-bold text-[17px] leading-snug text-white mb-2 line-clamp-2 group-hover:text-[--color-brand-hover] transition-colors">
            {title}
          </h3>
          <p className="text-sm text-[--color-text-muted] line-clamp-2 leading-relaxed mb-3">
            {excerpt}
          </p>
        </Link>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-0.5 bg-[--color-surface] border border-[--color-border] px-2 py-0.5 rounded text-[10px] font-mono text-[--color-text-muted]"
              >
                <Hash size={9} />
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Footer stats */}
        <div className="flex items-center justify-between pt-3 border-t border-[--color-border]">
          <div className="flex items-center gap-3">
            <Stat icon={Heart} value={formatNumber(likes.length)} />
            <Stat icon={MessageSquare} value={comments.length} />
            <Stat icon={Eye} value={formatNumber(views)} />
          </div>
          <span className="flex items-center gap-1 text-[10px] text-[--color-text-muted] font-mono">
            <Clock size={10} /> {readTime}m
          </span>
        </div>
      </div>
    </div>
  );
};

// ── Horizontal card (list/feed view) ────────────────────────────────────
const HorizontalCard = ({ blog }) => {
  const {
    title,
    slug,
    excerpt,
    coverImage,
    author,
    category,
    likes = [],
    views = 0,
    comments = [],
    readTime = 1,
    createdAt,
  } = blog;
  const name = author?.name || author?.username || "Anonymous";
  const avatar =
    author?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;

  return (
    <article className="group flex gap-5 py-6 border-b border-[--color-border] last:border-0">
      <div className="flex-1 min-w-0 order-2">
        <div className="flex items-center gap-2 mb-2">
          <img src={avatar} alt={name} className="w-5 h-5 rounded-full" />
          <span className="text-xs font-medium text-[--color-text-secondary]">
            {name}
          </span>
          <span className="text-[--color-text-muted] text-xs">·</span>
          <span className="text-xs text-[--color-text-muted] font-mono">
            {formatDate(createdAt)}
          </span>
        </div>
        <Link to={`/blog/${slug}`}>
          <h3 className="font-bold text-[17px] text-white mb-1.5 line-clamp-2 group-hover:text-[--color-brand-hover] transition-colors leading-snug">
            {title}
          </h3>
          <p className="text-sm text-[--color-text-muted] line-clamp-2 mb-3">
            {excerpt}
          </p>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold text-[--color-brand-hover] bg-[--color-brand-dim] border border-[rgba(99,102,241,0.2)] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {category}
          </span>
          <div className="flex items-center gap-3 ml-auto">
            <Stat icon={Clock} value={`${readTime}m`} />
            <Stat icon={Heart} value={formatNumber(likes.length)} />
            <Stat icon={MessageSquare} value={comments.length} />
          </div>
        </div>
      </div>
      {coverImage && (
        <div className="w-28 h-20 sm:w-32 sm:h-24 rounded-xl overflow-hidden bg-[--color-surface] flex-shrink-0 order-1 border border-[--color-border]">
          <img
            src={coverImage}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
          />
        </div>
      )}
    </article>
  );
};

// ── Featured card ────────────────────────────────────────────────────────
const FeaturedCard = ({ blog }) => {
  const {
    title,
    slug,
    excerpt,
    coverImage,
    author,
    category,
    likes = [],
    views = 0,
    readTime = 1,
  } = blog;
  const name = author?.name || author?.username || "Anonymous";
  const avatar =
    author?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;
  const { dot, label } = getCategoryStyle(category);

  return (
    <Link
      to={`/blog/${slug}`}
      className="card card-hover group flex flex-col overflow-hidden"
    >
      {coverImage && (
        <div className="h-44 overflow-hidden bg-[--color-surface] relative">
          <img
            src={coverImage}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[--color-card] via-transparent to-transparent" />
        </div>
      )}
      <div className="p-5 flex flex-col flex-1">
        <span
          className={`self-start inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wider mb-3 ${label}`}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: dot }}
          />
          {category}
        </span>
        <h3 className="font-bold text-[17px] text-white line-clamp-2 mb-2 leading-snug group-hover:text-[--color-brand-hover] transition-colors flex-1">
          {title}
        </h3>
        <p className="text-sm text-[--color-text-muted] line-clamp-2 mb-4">
          {excerpt}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-[--color-border]">
          <div className="flex items-center gap-2">
            <img src={avatar} alt={name} className="w-6 h-6 rounded-full" />
            <span className="text-xs text-[--color-text-secondary]">
              {name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Stat icon={Heart} value={formatNumber(likes.length)} />
            <Stat icon={Clock} value={`${readTime}m`} />
          </div>
        </div>
      </div>
    </Link>
  );
};

// ── Export with variant switch ───────────────────────────────────────────
const BlogCard = ({ blog, variant = "default" }) => {
  if (variant === "horizontal") return <HorizontalCard blog={blog} />;
  if (variant === "featured") return <FeaturedCard blog={blog} />;
  return <DefaultCard blog={blog} />;
};

export default BlogCard;
