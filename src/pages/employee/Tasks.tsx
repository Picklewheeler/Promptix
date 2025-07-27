import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from 'lucide-react';

// Mock user role - In production, this would come from your authentication system
const mockUserRole = 'executive'; // Options: 'executive', 'manager', 'employee'

const hasTaskManagementAccess = (role: string) => {
  const allowedRoles = ['executive', 'it_manager', 'systems_admin'];
  return allowedRoles.includes(role);
};

type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'Pending' | 'In Progress' | 'Completed';
  assignedTo: string;
};

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Update Server Infrastructure',
      description: 'Perform server maintenance and updates',
      dueDate: '2024-01-28',
      priority: 'high',
      status: 'In Progress',
      assignedTo: 'john.doe',
    },
    {
      id: '2',
      title: 'Review Security Protocols',
      description: 'Review and update security measures',
      dueDate: '2024-01-29',
      priority: 'medium',
      status: 'Pending',
      assignedTo: 'john.doe',
    },
    {
      id: '3',
      title: 'Database Backup Verification',
      description: 'Verify database backups',
      dueDate: '2024-01-27',
      priority: 'low',
      status: 'Completed',
      assignedTo: 'john.doe',
    },
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    assignedTo: '',
  });

  const handleAddTask = () => {
    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      status: 'Pending',
    };
    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      assignedTo: '',
    });
  };

  const handleUpdateStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    if (hasTaskManagementAccess(mockUserRole)) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-500';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'low':
        return 'bg-green-500/20 text-green-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-8">Tasks Management</h1>

      {/* New Task Form - Only visible to authorized roles */}
      {hasTaskManagementAccess(mockUserRole) && (
        <Card className="p-6 bg-[rgba(33,33,43,0.95)] backdrop-blur-md border-white/10">
          <h2 className="text-xl font-semibold mb-6">Add New Task</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Task Title</label>
              <Input
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Enter task title"
                className="bg-[rgba(255,255,255,0.05)] border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Description</label>
              <Textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Enter task description"
                className="bg-[rgba(255,255,255,0.05)] border-white/10 text-white"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Due Date</label>
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="bg-[rgba(255,255,255,0.05)] border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Priority</label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value: 'high' | 'medium' | 'low') => 
                    setNewTask({ ...newTask, priority: value })
                  }
                >
                  <SelectTrigger className="bg-[rgba(255,255,255,0.05)] border-white/10 text-white">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Assign To</label>
                <Input
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  placeholder="Enter username"
                  className="bg-[rgba(255,255,255,0.05)] border-white/10 text-white"
                />
              </div>
            </div>
            <Button
              onClick={handleAddTask}
              className="bg-gradient-to-r from-[#FF5552] to-[#F62623] hover:opacity-90 text-white"
            >
              Add Task
            </Button>
          </div>
        </Card>
      )}

      {/* My Tasks */}
      <Card className="p-6 bg-[rgba(33,33,43,0.95)] backdrop-blur-md border-white/10">
        <h2 className="text-xl font-semibold mb-6">My Tasks</h2>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-4 bg-[rgba(255,255,255,0.05)] rounded-lg border border-white/10"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{task.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{task.description}</p>
                </div>
                {hasTaskManagementAccess(mockUserRole) && (
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-400">Due: {task.dueDate}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                  {task.priority} priority
                </span>
                <Select
                  value={task.status}
                  onValueChange={(value: Task['status']) => handleUpdateStatus(task.id, value)}
                >
                  <SelectTrigger className="bg-[rgba(255,255,255,0.05)] border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Tasks;
