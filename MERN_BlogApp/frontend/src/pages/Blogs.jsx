import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { blogAPI } from "../services/api";
import BlogCard from "../components/blog/BlogCard";
import { BlogCardSkeleton } from "../components/ui/Skeletons";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { CATEGORIES, SORT_OPTIONS } from "../utils";
import { useDebounce } from "../hooks";

const Blogs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(
    searchParams.get("category") || "All",
  );
  const [sort, setSort] = useState("createdAt:desc");

  const debouncedSearch = useDebounce(search, 450);
  const page = parseInt(searchParams.get("page") || "1");

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const [sf, so] = sort.split(":");
      const { data } = await blogAPI.getAll({
        page,
        limit: 9,
        sort: sf,
        order: so,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(category !== "All" && { category }),
      });
      setBlogs(data.data || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, category, sort]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    const p = {};
    if (debouncedSearch) p.search = debouncedSearch;
    if (category !== "All") p.category = category;
    if (page > 1) p.page = page;
    setSearchParams(p, { replace: true });
  }, [debouncedSearch, category, page, setSearchParams]);

  const handleCategory = (cat) => {
    setCategory(cat);
    setSearchParams({}, { replace: true });
  };

  const handlePage = (n) => {
    setSearchParams((p) => {
      p.set("page", n);
      return p;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setSort("createdAt:desc");
    setSearchParams({});
  };

  const hasFilters = search || category !== "All" || sort !== "createdAt:desc";

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="border-b border-[--color-border] bg-[--color-surface]/50">
        <div className="container-page py-8">
          <h1 className="text-3xl font-black text-white mb-6 tracking-tight">
            Explore Articles
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[--color-text-muted]"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles, tags, topics…"
                className="input !pl-11"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[--color-text-muted] hover:text-white transition-colors"
                >
                  <X size={15} />
                </button>
              )}
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input !w-auto min-w-[140px] cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="btn-ghost gap-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <X size={14} /> Clear
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  category === cat
                    ? "bg-white text-black"
                    : "bg-[--color-card] border border-[--color-border] text-[--color-text-secondary] hover:text-white hover:border-[--color-border-strong]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container-page py-10">
        {!loading && (
          <p className="text-xs text-[--color-text-muted] font-mono mb-6">
            {pagination.total > 0
              ? `${pagination.total} articles${category !== "All" ? ` in ${category}` : ""}${search ? ` matching "${search}"` : ""}`
              : "No articles found"}
          </p>
        )}

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <BlogCardSkeleton key={n} />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-[--color-border] rounded-2xl">
            <Search
              size={36}
              className="mx-auto text-[--color-text-muted] mb-4 opacity-30"
            />
            <h3 className="font-bold text-white mb-2">No articles found</h3>
            <p className="text-sm text-[--color-text-muted] mb-6">
              {hasFilters
                ? "Try adjusting your search or filters."
                : "Be the first to publish!"}
            </p>
            {hasFilters && (
              <button onClick={clearFilters} className="btn-secondary">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {blogs.map((b) => (
              <BlogCard key={b._id} blog={b} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => handlePage(page - 1)}
              disabled={page === 1}
              className="btn-ghost !p-2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={17} />
            </button>
            <div className="flex gap-1">
              {Array.from(
                { length: Math.min(pagination.pages, 7) },
                (_, i) => i + 1,
              ).map((n) => (
                <button
                  key={n}
                  onClick={() => handlePage(n)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    page === n
                      ? "bg-white text-black"
                      : "text-[--color-text-secondary] hover:bg-white/5"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePage(page + 1)}
              disabled={page === pagination.pages}
              className="btn-ghost !p-2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
