import React, { useState } from 'react';
import { useSelector } from 'react-redux';
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
  User as UserIcon,
  Tag,
  Loader2,
  Trash2,
} from 'lucide-react';
import { 
  useGetTasksQuery, 
  useCreateTaskMutation, 
  useUpdateTaskStatusMutation, 
  useDeleteTaskMutation,
  useGetUsersQuery 
} from '@store/services/chatApi';
import Avatar from '@components/common/Avatar';

const COLUMNS = [
  { id: 'To Do', label: 'To Do', icon: Clock, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20' },
  { id: 'In Progress', label: 'In Progress', icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { id: 'Completed', label: 'Completed', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
];

const priorityConfig = {
  Critical: { label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/15', dot: 'bg-red-500' },
  High: { label: 'High', color: 'text-orange-400', bg: 'bg-orange-500/15', dot: 'bg-orange-500' },
  Medium: { label: 'Medium', color: 'text-blue-400', bg: 'bg-blue-500/15', dot: 'bg-blue-500' },
  Low: { label: 'Low', color: 'text-slate-400', bg: 'bg-slate-500/15', dot: 'bg-slate-500' },
};

const TasksPage = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  const [isDraggingOver, setIsDraggingOver] = useState(null);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    assigneeId: null,
  });

  // API Hooks
  const { data: tasksData, isLoading: tasksLoading } = useGetTasksQuery(1); 
  const { data: usersData } = useGetUsersQuery();
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateStatus] = useUpdateTaskStatusMutation(); 
  const [deleteTask] = useDeleteTaskMutation();

  const tasks = tasksData?.tasks || tasksData?.data?.tasks || [];
  const users = usersData?.users || usersData?.data?.users || [];

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getColumnTasks = (status) =>
    filteredTasks.filter((task) => task.status === status);

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    const ghost = e.currentTarget.cloneNode(true);
    ghost.style.opacity = '0.5';
    ghost.style.position = 'absolute';
    ghost.style.top = '-1000px';
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    setTimeout(() => document.body.removeChild(ghost), 0);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    setIsDraggingOver(columnId);
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    setIsDraggingOver(null);
    if (draggedTask && draggedTask.status !== newStatus) {
      try {
        await updateStatus({ id: parseInt(draggedTask.id), status: newStatus }).unwrap();
      } catch (err) {
        console.error('Failed to update task status:', err);
      }
    }
    setDraggedTask(null);
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;
    try {
      await createTask({
        title: newTask.title,
        description: newTask.description,
        workspaceId: 1,
        priority: newTask.priority,
        assigneeId: newTask.assigneeId ? parseInt(newTask.assigneeId) : null
      }).unwrap();
      
      setNewTask({ title: '', description: '', priority: 'Medium', assigneeId: null });
      setShowAddModal(false);
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await deleteTask(parseInt(id)).unwrap();
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  if (tasksLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-light-bg dark:bg-dark-bg transition-colors duration-300">
        <Loader2 className="h-12 w-12 text-primary-500 animate-spin mb-4" />
        <p className="text-light-text/60 dark:text-dark-text/60 font-bold uppercase tracking-widest animate-pulse">Initializing Board...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-light-bg dark:bg-dark-bg transition-colors duration-300 overflow-hidden font-sans">
      {/* Header */}
      <div className="px-8 py-6 border-b border-light-border dark:border-dark-border bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-xl transition-colors duration-300">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-3xl font-black text-light-text dark:text-dark-text tracking-tighter italic uppercase">Mission Board</h1>
            <p className="text-[10px] text-light-muted dark:text-dark-muted font-black uppercase tracking-[0.2em] mt-1">
              Active: {tasks.filter(t => t.status !== 'Completed').length} · Finalized: {tasks.filter(t => t.status === 'Completed').length}
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-primary-500/20 transition-all hover:-translate-y-1 active:scale-95"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            New Mission
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-light-muted dark:text-dark-muted group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              placeholder="SEARCH PROTOCOLS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl text-[11px] font-bold text-light-text dark:text-dark-text placeholder-light-muted dark:placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all uppercase tracking-wider"
            />
          </div>
          <button className="p-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl text-light-muted dark:text-dark-muted hover:text-primary-500 hover:border-primary-500/30 transition-all">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-8">
        <div className="flex gap-6 h-full min-w-max">
          {COLUMNS.map((column) => {
            const columnTasks = getColumnTasks(column.id);
            const isTarget = isDraggingOver === column.id;
            
            return (
              <div
                key={column.id}
                className={`w-[320px] flex flex-col bg-light-surface/40 dark:bg-dark-surface/40 rounded-3xl border transition-all duration-300 ${isTarget ? 'border-primary-500/50 bg-primary-500/5' : 'border-light-border/40 dark:border-dark-border/40'}`}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={() => setIsDraggingOver(null)}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {/* Column Header */}
                <div className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${column.bg}`}>
                      <column.icon className={`h-3.5 w-3.5 ${column.color}`} />
                    </div>
                    <h3 className="font-black text-light-text/80 dark:text-dark-text/80 text-[11px] uppercase tracking-[0.15em]">{column.label}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${column.bg} ${column.color}`}>
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                {/* Task Cards */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
                  {columnTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 opacity-10">
                       <column.icon className={`h-10 w-10 ${column.color} mb-3`} />
                       <p className="text-light-muted dark:text-dark-muted text-[9px] font-black uppercase tracking-widest">Clear</p>
                    </div>
                  ) : (
                    columnTasks.map((task) => {
                      const priority = priorityConfig[task.priority] || priorityConfig.Medium;
                      return (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task)}
                          className={`group relative p-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl cursor-grab active:cursor-grabbing hover:border-primary-500/30 transition-all hover:shadow-xl ${draggedTask?.id === task.id ? 'opacity-20' : ''}`}
                        >
                          <div className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full ${priority.dot} opacity-60`}></div>

                          <div className="pl-2">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-bold text-[12px] text-light-text dark:text-dark-text leading-tight group-hover:text-primary-400 transition-colors line-clamp-2">{task.title}</h4>
                              <button 
                                onClick={() => handleDeleteTask(task.id)}
                                className="p-1 text-light-muted dark:text-dark-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>

                            {task.description && (
                              <p className="text-[10px] text-light-muted dark:text-dark-muted leading-normal line-clamp-1 mb-2 font-medium">
                                {task.description}
                              </p>
                            )}

                            {/* Tags */}
                            {task.tags && task.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {task.tags.map(tag => (
                                  <span key={tag} className="px-1.5 py-0.5 bg-light-surface dark:bg-dark-surface text-[8px] font-black uppercase text-light-muted dark:text-dark-muted rounded border border-light-border dark:border-dark-border">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-2 border-t border-light-border dark:border-dark-border">
                              <div className="flex items-center gap-2">
                                <Avatar 
                                  src={task.assignee?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignee?.username || 'U'}`} 
                                  size="xs" 
                                  className="ring-1 ring-light-border dark:ring-dark-border"
                                />
                                <span className="text-[9px] text-light-muted dark:text-dark-muted font-bold uppercase tracking-tight truncate max-w-[70px]">
                                  {task.assignee?.username || 'NONE'}
                                </span>
                              </div>
                              {task.dueDate && (
                                <div className="flex items-center gap-1 text-[8px] text-light-muted dark:text-dark-muted font-bold uppercase">
                                  <Calendar className="h-2.5 w-2.5" />
                                  {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-[32px] shadow-2xl animate-scale-up overflow-hidden transition-colors duration-300">
            <div className="px-8 py-6 border-b border-light-border dark:border-dark-border flex items-center justify-between bg-light-bg/5 dark:bg-dark-bg/5">
              <h3 className="text-xl font-black text-light-text dark:text-dark-text uppercase tracking-tighter italic">Create New Mission</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface rounded-xl transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-light-muted dark:text-dark-muted uppercase tracking-widest mb-3">Target Objective</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="WHAT NEEDS TO BE DONE?"
                  className="w-full px-5 py-4 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-2xl text-sm font-bold text-light-text dark:text-dark-text placeholder-light-muted dark:placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all uppercase tracking-wide"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-light-muted dark:text-dark-muted uppercase tracking-widest mb-3">Intelligence Report</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="ADDITIONAL DETAILS..."
                  rows={3}
                  className="w-full px-5 py-4 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-2xl text-sm font-bold text-light-text dark:text-dark-text placeholder-light-muted dark:placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all resize-none uppercase tracking-wide"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-light-muted dark:text-dark-muted uppercase tracking-widest mb-3">Priority Level</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full px-5 py-4 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-2xl text-[11px] font-black text-light-text dark:text-dark-text uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all appearance-none cursor-pointer"
                  >
                    <option value="Critical">🔴 Critical</option>
                    <option value="High">🟠 High</option>
                    <option value="Medium">🔵 Medium</option>
                    <option value="Low">⚪ Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-light-muted dark:text-dark-muted uppercase tracking-widest mb-3">Assigned Operative</label>
                  <select
                    value={newTask.assigneeId || ''}
                    onChange={(e) => setNewTask({ ...newTask, assigneeId: e.target.value })}
                    className="w-full px-5 py-4 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-2xl text-[11px] font-black text-light-text dark:text-dark-text uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">UNASSIGNED</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.username.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="p-8 bg-light-bg/5 dark:bg-dark-bg/5 flex items-center justify-end gap-4 border-t border-light-border dark:border-dark-border">
              <button onClick={() => setShowAddModal(false)} className="px-6 py-3 text-xs font-black text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text uppercase tracking-widest transition-all">Cancel</button>
              <button
                onClick={handleAddTask}
                disabled={!newTask.title.trim() || isCreating}
                className="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-primary-500/20 transition-all active:scale-95 flex items-center gap-2"
              >
                {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 stroke-[3]" />}
                Initialize Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
