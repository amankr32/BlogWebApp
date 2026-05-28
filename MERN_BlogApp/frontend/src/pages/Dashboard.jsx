import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import toast from 'react-hot-toast';
import { Edit2, Trash2, ArrowUpRight, ShieldCheck, Layers } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [workspaceItems, setWorkspaceItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRegistry = async () => {
    try {
      const { data } = await API.get('/blogs');
      setWorkspaceItems(data.filter(b => b.author?._id === user?._id));
    } catch (err) {
      toast.error("Dashboard asset syncing failure.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user) loadRegistry(); }, [user]);

  const purgeRecord = async (id) => {
    if (!window.confirm("Verify hardware instruction record stack purge sequence?")) return;
    try {
      await API.delete(`/blogs/${id}`);
      toast.success("Document entry record dropped cleanly.");
      setWorkspaceItems(workspaceItems.filter(item => item._id !== id));
    } catch (err) {
      toast.error("Purge instruction stack failure.");
    }
  };

  if (loading) return <div className="py-20 text-center font-mono text-xs text-saas-muted animate-pulse">Querying workspace operational records...</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 pb-8 border-b border-saas-border">
        <div>
          <h2 className="font-sans text-3xl font-bold text-white tracking-tight">Console Space</h2>
          <div className="flex items-center gap-2 text-xs font-mono text-saas-muted mt-1.5">
            <ShieldCheck size={13} className="text-saas-brand" /> Operational ID: {user?.username}
          </div>
        </div>
        <Link to="/create" className="btn-premium font-sans text-xs">
          Provision Asset Descriptor
        </Link>
      </div>

      {workspaceItems.length === 0 ? (
        <div className="glass-panel text-center py-20 rounded-2xl border-dashed">
          <Layers size={24} className="mx-auto text-zinc-700 mb-4" />
          <p className="text-saas-muted text-sm font-sans mb-4">No data streams currently registered under this active operator key matrix.</p>
          <Link to="/create" className="text-xs text-white underline font-mono hover:text-saas-brand transition-colors">Write First Document Node</Link>
        </div>
      ) : (
        <div className="glass-panel rounded-xl overflow-hidden shadow-premium">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-zinc-900/50 text-saas-muted border-b border-saas-border uppercase tracking-wider">
                  <th className="p-4 font-medium">Record Title</th>
                  <th className="p-4 font-medium">Indexed Date</th>
                  <th className="p-4 font-medium text-right">Directives</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-saas-border bg-transparent font-sans text-sm">
                {workspaceItems.map((blog) => (
                  <tr key={blog._id} className="hover:bg-white/[0.02] transition-colors duration-150">
                    <td className="p-4 font-medium text-white max-w-xs sm:max-w-md truncate">{blog.title}</td>
                    <td className="p-4 text-xs font-mono text-saas-muted">{new Date(blog.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right font-mono text-xs">
                      <div className="inline-flex items-center gap-4">
                        <Link to={`/blog/${blog.slug}`} className="text-saas-muted hover:text-white transition-colors">
                          <ArrowUpRight size={15} />
                        </Link>
                        <Link to={`/edit/${blog._id}`} className="text-saas-muted hover:text-saas-brand transition-colors">
                          <Edit2 size={14} />
                        </Link>
                        <button onClick={() => purgeRecord(blog._id)} className="text-saas-muted hover:text-red-400 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;