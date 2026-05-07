import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { CheckCircle2, Clock, ListTodo, AlertCircle, LayoutDashboard, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.role === 'ROLE_ADMIN') {
          const [tasksRes, projectsRes] = await Promise.all([
            api.get('/tasks'),
            api.get('/projects')
          ]);
          setTasks(tasksRes.data);
          setProjects(projectsRes.data);
        } else {
          const tasksRes = await api.get(`/tasks/assignee/${user?.id}`);
          setTasks(tasksRes.data);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-28"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-80"></div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-80"></div>
        </div>
      </div>
    );
  }

  const todoTasks = tasks.filter(t => t.status === 'TODO').length;
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const doneTasks = tasks.filter(t => t.status === 'DONE').length;

  const statusData = [
    { name: 'To Do', value: todoTasks, color: '#3b82f6' }, // blue
    { name: 'In Progress', value: inProgressTasks, color: '#eab308' }, // yellow
    { name: 'Done', value: doneTasks, color: '#22c55e' }, // green
  ];

  const priorityData = [
    { name: 'High', value: tasks.filter(t => t.priority === 'HIGH').length },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'MEDIUM').length },
    { name: 'Low', value: tasks.filter(t => t.priority === 'LOW').length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {user?.role === 'ROLE_ADMIN' && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Projects</p>
              <h3 className="text-2xl font-bold text-gray-900">{projects.length}</h3>
            </div>
          </div>
        )}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <ListTodo size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Tasks</p>
            <h3 className="text-2xl font-bold text-gray-900">{tasks.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">In Progress</p>
            <h3 className="text-2xl font-bold text-gray-900">{inProgressTasks}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Completed</p>
            <h3 className="text-2xl font-bold text-gray-900">{doneTasks}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Status Breakdown</h2>
          {tasks.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {statusData.map(item => (
                  <div key={item.name} className="flex items-center text-sm text-gray-600">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                    {item.name} ({item.value})
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400">
              <AlertCircle className="h-10 w-10 mb-2" />
              <p>No tasks available</p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Priority</h2>
          {tasks.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip cursor={{ fill: '#f3f4f6' }} />
                  <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400">
              <AlertCircle className="h-10 w-10 mb-2" />
              <p>No tasks available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
