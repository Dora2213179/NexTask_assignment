import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import { FolderKanban, Plus, MoreVertical, Calendar, User, Trash2, Edit, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Projects() {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        setProjects(projects.filter(p => p.id !== id));
        toast.success('Project deleted successfully');
      } catch (err) {
        toast.error('Failed to delete project');
      }
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Project title is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/projects', formData);
      setProjects([...projects, res.data]);
      toast.success('Project created successfully!');
      setIsModalOpen(false);
      setFormData({ title: '', description: '' });
    } catch (err) {
      toast.error('Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-48"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your team's projects</p>
        </div>
        
        {(user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_MANAGER') && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Plus size={20} />
            New Project
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-16 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
            <FolderKanban className="h-8 w-8 text-indigo-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-500 mb-6 max-w-sm">
            Get started by creating a new project. Projects help you group related tasks together for your team.
          </p>
          {(user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_MANAGER') && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus size={20} /> Create your first project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col group">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 line-clamp-1 pr-4">{project.title}</h3>
                  {(user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_MANAGER') && (
                    <div className="relative group/menu">
                      <button className="text-gray-400 hover:text-indigo-600 p-1.5 rounded-md hover:bg-indigo-50 transition-colors">
                        <MoreVertical size={18} />
                      </button>
                      <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 transform origin-top-right scale-95 group-hover/menu:scale-100">
                        <div className="py-1">
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                            <Edit size={14} /> Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(project.id)}
                            className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-6 line-clamp-3 min-h-[3rem]">
                  {project.description || "No description provided."}
                </p>
                <div className="space-y-3 mt-auto">
                  <div className="flex items-center text-xs text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-md w-max">
                    <Calendar size={14} className="mr-2 text-indigo-400" />
                    {new Date(project.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 px-1">
                    <User size={14} className="mr-2 text-slate-400" />
                    Created by <span className="font-medium ml-1 text-slate-700">{project.createdByName}</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/50 rounded-b-xl flex justify-between items-center transition-colors group-hover:bg-indigo-50/30">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-sm font-medium text-slate-600">Active</span>
                </div>
                <Link 
                  to={`/projects/${project.id}/board`} 
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                >
                  View Board &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-900">Create New Project</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project Title <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="e.g. Q3 Marketing Campaign"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all min-h-[100px] resize-y"
                  placeholder="Briefly describe the project goals..."
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
                  {isSubmitting ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
