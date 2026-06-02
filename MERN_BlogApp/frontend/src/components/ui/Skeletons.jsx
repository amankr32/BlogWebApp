const S = ({ className = "" }) => <div className={`skeleton ${className}`} />;

export const BlogCardSkeleton = () => (
  <div className="card p-6 space-y-4">
    <div className="flex items-center gap-3">
      <S className="w-8 h-8 rounded-full" />
      <div className="space-y-1.5 flex-1">
        <S className="h-3 w-24" />
        <S className="h-2.5 w-16" />
      </div>
    </div>
    <S className="h-5 w-3/4" />
    <S className="h-4 w-full" />
    <S className="h-4 w-5/6" />
    <div className="flex gap-2 pt-1">
      <S className="h-5 w-16 rounded-full" />
      <S className="h-5 w-20 rounded-full" />
    </div>
  </div>
);

export const FeaturedBlogSkeleton = () => (
  <div className="card overflow-hidden">
    <S className="h-44 rounded-none rounded-t-2xl" />
    <div className="p-5 space-y-3">
      <S className="h-3 w-20 rounded-full" />
      <S className="h-6 w-3/4" />
      <S className="h-4 w-full" />
      <S className="h-4 w-2/3" />
    </div>
  </div>
);

export const PostSkeleton = () => (
  <div className="max-w-3xl mx-auto py-12 space-y-6">
    <div className="space-y-3">
      <S className="h-3 w-24 rounded-full" />
      <S className="h-12 w-full" />
      <S className="h-8 w-2/3" />
    </div>
    <div className="flex items-center gap-3 py-4 border-y border-[--color-border]">
      <S className="h-10 w-10 rounded-full" />
      <div className="space-y-2">
        <S className="h-3.5 w-32" />
        <S className="h-3 w-24" />
      </div>
    </div>
    <S className="h-64 rounded-2xl" />
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((n) => (
        <S key={n} className={`h-4 ${n % 2 === 0 ? "w-full" : "w-5/6"}`} />
      ))}
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-start gap-5">
      <S className="w-24 h-24 rounded-2xl" />
      <div className="flex-1 space-y-3 pt-2">
        <S className="h-6 w-40" />
        <S className="h-4 w-64" />
        <S className="h-4 w-48" />
      </div>
    </div>
    <div className="grid grid-cols-4 gap-3">
      {[1, 2, 3, 4].map((n) => (
        <S key={n} className="h-16 rounded-xl" />
      ))}
    </div>
  </div>
);

export const DashboardStatSkeleton = () => (
  <div className="card p-6 space-y-3">
    <S className="h-4 w-20" />
    <S className="h-9 w-16" />
    <S className="h-3 w-24" />
  </div>
);

export const TableRowSkeleton = ({ cols = 4 }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-5 py-4">
        <S className="h-4" />
      </td>
    ))}
  </tr>
);
