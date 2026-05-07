import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import { Plus, Calendar, ChevronLeft, X, Loader2, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { toast } from 'sonner';

export default function KanbanBoard() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]); // For assignee dropdown

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    assigneeId: ''
  });

  const fetchBoardData = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks/project/${id}`)
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
      
      if (user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_MANAGER') {
        const usersRes = await api.get('/users');
        setUsers(usersRes.data);
      }
    } catch (err) {
      toast.error('Failed to load board data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardData();
  }, [id]);

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const taskId = parseInt(draggableId);
    const newStatus = destination.droppableId;
    
    // Optimistic UI update
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (!taskToUpdate) return;
    
    // Create new array with updated task status
    const updatedTasks = tasks.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    );
    setTasks(updatedTasks);
    
    try {
      await api.put(`/tasks/${taskId}`, {
        ...taskToUpdate,
        status: newStatus
      });
      toast.success(`Task moved to ${newStatus.replace('_', ' ')}`);
    } catch (err) {
      toast.error('Failed to move task. Reverting changes.');
      fetchBoardData(); // Revert
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...newTask,
        projectId: parseInt(id as string),
        assigneeId: newTask.assigneeId ? parseInt(newTask.assigneeId) : null
      };
      const res = await api.post('/tasks', payload);
      setTasks([...tasks, res.data]);
      toast.success('Task created successfully');
      setIsModalOpen(false);
      setNewTask({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', assigneeId: '' });
    } catch (err) {
      toast.error('Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-6rem)] p-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
        <div className="flex gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-80 h-[500px] bg-slate-100 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!project) return <div className="text-center p-12 text-rose-500">Project not found</div>;

  const columns = [
    { id: 'TODO', title: 'To Do', color: 'bg-slate-500', headerBg: 'bg-slate-100', borderColor: 'border-slate-200' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-indigo-500', headerBg: 'bg-indigo-50', borderColor: 'border-indigo-100' },
    { id: 'DONE', title: 'Done', color: 'bg-emerald-500', headerBg: 'bg-emerald-50', borderColor: 'border-emerald-100' }
  ];

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'HIGH': return 'text-rose-600 bg-rose-100 border-rose-200';
      case 'MEDIUM': return 'text-amber-600 bg-amber-100 border-amber-200';
      case 'LOW': return 'text-emerald-600 bg-emerald-100 border-emerald-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Link to="/projects" className="hover:text-indigo-600 flex items-center transition-colors">
              <ChevronLeft size={16} />
              Back to Projects
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{project.title}</h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">{project.description}</p>
        </div>
        
        {(user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_MANAGER') && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-all whitespace-nowrap active:scale-95"
          >
            <Plus size={20} />
            Add Task
          </button>
        )}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 flex overflow-x-auto gap-6 pb-4">
          {columns.map(col => (
            <div key={col.id} className={`flex-shrink-0 w-80 flex flex-col bg-slate-50/50 rounded-xl border ${col.borderColor}`}>
              <div className={`p-4 border-b ${col.borderColor} flex justify-between items-center ${col.headerBg} rounded-t-xl`}>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${col.color}`}></div>
                  <h3 className="font-semibold text-slate-800">{col.title}</h3>
                </div>
                <span className="bg-white border border-slate-200 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                  {tasks.filter(t => t.status === col.id).length}
                </span>
              </div>
              
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-1 overflow-y-auto p-3 space-y-3 transition-colors ${snapshot.isDraggingOver ? 'bg-indigo-50/50' : ''}`}
                  >
                    {tasks.filter(t => t.status === col.id).map((task, index) => (
                      <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <div 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`bg-white p-4 rounded-lg border border-slate-200 group transition-all
                              ${snapshot.isDragging ? 'shadow-lg ring-2 ring-indigo-500/50 rotate-2' : 'shadow-sm hover:border-indigo-300 hover:shadow-md'}`}
                            style={provided.draggableProps.style}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className={`border text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                              
                              <div {...provided.dragHandleProps} className="text-slate-300 hover:text-slate-500 transition-colors cursor-grab active:cursor-grabbing">
                                <GripVertical size={16} />
                              </div>
                            </div>
                            
                            <h4 className="font-semibold text-slate-900 mb-1 leading-snug">{task.title}</h4>
                            <p className="text-sm text-slate-600 mb-4 line-clamp-2">{task.description}</p>
                            
                            <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                              <div className="flex items-center text-xs text-slate-500" title="Assignee">
                                <div className="w-6 h-6 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold mr-2">
                                  {task.assigneeName ? task.assigneeName.charAt(0) : '?'}
                                </div>
                                <span className="truncate max-w-[80px] font-medium">{task.assigneeName || 'Unassigned'}</span>
                              </div>
                              {task.dueDate && (
                                <div className="flex items-center text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded">
                                  <Calendar size={12} className="mr-1" />
                                  {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {tasks.filter(t => t.status === col.id).length === 0 && (
                      <div className="flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                        <p className="text-sm font-medium text-slate-500">No tasks yet</p>
                      </div>
                    )}
                    {provided.placeholder}
                    
                    {(user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_MANAGER') && col.id === 'TODO' && (
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-full py-2.5 flex justify-center items-center gap-1 text-sm text-slate-500 hover:bg-white rounded-lg transition-colors border border-dashed border-slate-300 hover:border-indigo-300 hover:text-indigo-600"
                      >
                        <Plus size={16} /> Add a card
                      </button>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-900">Create New Task</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Task Title <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="e.g. Update user authentication flow"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all min-h-[80px]"
                  placeholder="Details about the task..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assignee</label>
                <select
                  value={newTask.assigneeId}
                  onChange={(e) => setNewTask({...newTask, assigneeId: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
                >
                  <option value="">Unassigned</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
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
                  {isSubmitting ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
