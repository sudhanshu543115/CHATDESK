import React, { useState } from 'react';
import {
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreHorizontal,
  Calendar,
  Flag,
  Search,
  Filter,
  X,
  ChevronDown,
  User,
  Tag,
} from 'lucide-react';

const INITIAL_TASKS = [
  {
    id: 't1',
    title: 'Complete UI Redesign',
    description: 'Redesign the dashboard with new color scheme and improved UX patterns.',
    status: 'in-progress',
    priority: 'high',
    assignee: { name: 'Jane Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane' },
    tags: ['Design', 'Frontend'],
    dueDate: '2026-05-20',
    createdAt: '2026-05-10',
  },
  {
    id: 't2',
    title: 'Fix Authentication Bugs',
    description: 'Resolve session timeout and token refresh issues in the auth flow.',
    status: 'todo',
    priority: 'critical',
    assignee: { name: 'Alex Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
    tags: ['Bug', 'Backend'],
    dueDate: '2026-05-16',
    createdAt: '2026-05-12',
  },
  {
    id: 't3',
    title: 'Write API Documentation',
    description: 'Document all REST endpoints with request/response examples.',
    status: 'completed',
    priority: 'low',
    assignee: { name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
    tags: ['Docs'],
    dueDate: '2026-05-14',
    createdAt: '2026-05-08',
  },
  {
    id: 't4',
    title: 'Setup CI/CD Pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment.',
    status: 'todo',
    priority: 'medium',
    assignee: { name: 'Jane Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane' },
    tags: ['DevOps'],
    dueDate: '2026-05-22',
    createdAt: '2026-05-11',
  },
  {
    id: 't5',
    title: 'Implement WebSocket Events',
    description: 'Add real-time typing indicators and presence updates.',
    status: 'in-progress',
    priority: 'high',
    assignee: { name: 'Alex Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
    tags: ['Backend', 'Real-time'],
    dueDate: '2026-05-18',
    createdAt: '2026-05-09',
  },
  {
    id: 't6',
    title: 'Add File Upload Support',
    description: 'Allow users to upload and share files in chat conversations.',
    status: 'todo',
    priority: 'medium',
    assignee: { name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
    tags: ['Feature', 'Frontend'],
    dueDate: '2026-05-25',
    createdAt: '2026-05-13',
  },
];

const COLUMNS = [
  { id: 'todo', label: 'To Do', icon: Clock, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20' },
  { id: 'in-progress', label: 'In Progress', icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { id: 'completed', label: 'Completed', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
];

const priorityConfig = {
  critical: { label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/15', dot: 'bg-red-500' },
  high: { label: 'High', color: 'text-orange-400', bg: 'bg-orange-500/15', dot: 'bg-orange-500' },
  medium: { label: 'Medium', color: 'text-blue-400', bg: 'bg-blue-500/15', dot: 'bg-blue-500' },
  low: { label: 'Low', color: 'text-slate-400', bg: 'bg-slate-500/15', dot: 'bg-slate-500' },
};

const tagColors = {
  Design: 'bg-purple-500/15 text-purple-400',
  Frontend: 'bg-blue-500/15 text-blue-400',
  Backend: 'bg-green-500/15 text-green-400',
  Bug: 'bg-red-500/15 text-red-400',
  Docs: 'bg-cyan-500/15 text-cyan-400',
  DevOps: 'bg-yellow-500/15 text-yellow-400',
  Feature: 'bg-indigo-500/15 text-indigo-400',
  'Real-time': 'bg-pink-500/15 text-pink-400',
};

const TasksPage = () => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assignee: '',
    tags: [],
    dueDate: '',
  });

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getColumnTasks = (status) =>
    filteredTasks.filter((task) => task.status === status);

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    if (draggedTask) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === draggedTask.id ? { ...t, status: newStatus } : t
        )
      );
      setDraggedTask(null);
    }
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    const task = {
      id: `t${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      status: 'todo',
      priority: newTask.priority,
      assignee: {
        name: newTask.assignee || 'Unassigned',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newTask.assignee || 'Unknown'}`,
      },
      tags: newTask.tags,
      dueDate: newTask.dueDate,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks((prev) => [...prev, task]);
    setNewTask({ title: '', description: '', priority: 'medium', assignee: '', tags: [], dueDate: '' });
    setShowAddModal(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">Tasks</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">
              {tasks.length} total · {tasks.filter(t => t.status === 'completed').length} completed
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/25 transition-all hover:-translate-y-0.5 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            New Task
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
            />
          </div>
          <button className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <div className="flex gap-5 h-full min-w-max">
          {COLUMNS.map((column) => {
            const columnTasks = getColumnTasks(column.id);
            return (
              <div
                key={column.id}
                className="w-[340px] flex flex-col bg-slate-900/50 rounded-2xl border border-slate-800/60 overflow-hidden"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {/* Column Header */}
                <div className="px-5 py-4 border-b border-slate-800/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${column.bg}`}>
                        <column.icon className={`h-4 w-4 ${column.color}`} />
                      </div>
                      <h3 className="font-bold text-slate-200 text-sm">{column.label}</h3>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${column.bg} ${column.color}`}>
                        {columnTasks.length}
                      </span>
                    </div>
                    <button className="p-1 text-slate-500 hover:text-slate-300 transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Task Cards */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                  {columnTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className={`p-3 rounded-xl ${column.bg} mb-3`}>
                        <column.icon className={`h-6 w-6 ${column.color} opacity-50`} />
                      </div>
                      <p className="text-slate-500 text-xs font-medium">No tasks here</p>
                      <p className="text-slate-600 text-[10px] mt-1">Drag tasks or create new ones</p>
                    </div>
                  ) : (
                    columnTasks.map((task) => {
                      const priority = priorityConfig[task.priority];
                      return (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task)}
                          className="p-4 bg-slate-900 border border-slate-800 rounded-xl cursor-grab active:cursor-grabbing hover:border-slate-700 transition-all group hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5"
                        >
                          {/* Priority & Actions */}
                          <div className="flex items-center justify-between mb-3">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${priority.bg} ${priority.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`}></span>
                              {priority.label}
                            </span>
                            <button className="p-1 text-slate-600 opacity-0 group-hover:opacity-100 hover:text-slate-300 transition-all">
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Title & Description */}
                          <h4 className="font-bold text-sm text-slate-200 mb-1.5 leading-snug">{task.title}</h4>
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">{task.description}</p>

                          {/* Tags */}
                          {task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {task.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${tagColors[tag] || 'bg-slate-500/15 text-slate-400'}`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Footer: Assignee & Due Date */}
                          <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
                            <div className="flex items-center gap-2">
                              <img
                                src={task.assignee.avatar}
                                alt={task.assignee.name}
                                className="w-5 h-5 rounded-full ring-1 ring-slate-700"
                              />
                              <span className="text-[11px] text-slate-400 font-medium">{task.assignee.name}</span>
                            </div>
                            {task.dueDate && (
                              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                                <Calendar className="h-3 w-3" />
                                {formatDate(task.dueDate)}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Add task to column */}
                {column.id === 'todo' && (
                  <div className="p-3 border-t border-slate-800/60">
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="w-full py-2.5 border-2 border-dashed border-slate-700 rounded-xl text-slate-500 text-xs font-bold hover:border-primary-500/50 hover:text-primary-400 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Task
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg mx-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl animate-slide-up overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-slate-100">Create New Task</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Enter task title..."
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Describe the task..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all resize-none"
                />
              </div>

              {/* Priority & Assignee Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="critical">🔴 Critical</option>
                    <option value="high">🟠 High</option>
                    <option value="medium">🔵 Medium</option>
                    <option value="low">⚪ Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Assignee</label>
                  <input
                    type="text"
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                    placeholder="Name..."
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/50">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary-500/25 transition-all active:scale-95"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
