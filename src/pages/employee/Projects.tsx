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
import { Progress } from '@/components/ui/progress';
import { 
  Calendar,
  DollarSign,
  Users,
  Clock,
  Briefcase
} from 'lucide-react';

// Mock user role - In production, this would come from your authentication system
const mockUserRole = 'executive'; // Options: 'executive', 'it_manager', 'systems_admin', 'employee'

const hasProjectManagementAccess = (role: string) => {
  const allowedRoles = ['executive', 'it_manager', 'systems_admin'];
  return allowedRoles.includes(role);
};

type Project = {
  id: string;
  title: string;
  description: string;
  client: string;
  budget: number;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  assignedTo: string[];
  priority: 'high' | 'medium' | 'low';
};

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'Custom Phone Cases Batch',
      description: 'Design and produce custom phone cases for TechCorp',
      client: 'TechCorp',
      budget: 2500,
      dueDate: '2024-02-15',
      status: 'In Progress',
      assignedTo: ['john.doe', 'jane.smith'],
      priority: 'medium'
    },
    {
      id: '2',
      title: 'Architectural Model Series',
      description: '3D printing architectural models for client presentation',
      client: 'ArchStudio',
      budget: 8000,
      dueDate: '2024-03-01',
      status: 'In Progress',
      assignedTo: ['mike.wilson'],
      priority: 'high'
    },
    {
      id: '3',
      title: 'Medical Device Prototypes',
      description: 'Prototype development for medical devices',
      client: 'MedTech Inc',
      budget: 12000,
      dueDate: '2024-01-20',
      status: 'Completed',
      assignedTo: ['sarah.jones', 'alex.brown'],
      priority: 'high'
    }
  ]);

  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    client: '',
    budget: '',
    dueDate: '',
    assignedTo: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
  });

  const handleAddProject = () => {
    if (!hasProjectManagementAccess(mockUserRole)) return;

    const project: Project = {
      id: Date.now().toString(),
      ...newProject,
      budget: Number(newProject.budget),
      status: 'Pending',
      assignedTo: newProject.assignedTo.split(',').map(s => s.trim()),
    };
    setProjects([...projects, project]);
    setNewProject({
      title: '',
      description: '',
      client: '',
      budget: '',
      dueDate: '',
      assignedTo: '',
      priority: 'medium',
    });
  };

  const handleUpdateStatus = (projectId: string, newStatus: Project['status']) => {
    setProjects(projects.map(project => 
      project.id === projectId ? { ...project, status: newStatus } : project
    ));
  };

  const handleDeleteProject = (projectId: string) => {
    if (hasProjectManagementAccess(mockUserRole)) {
      setProjects(projects.filter(project => project.id !== projectId));
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500/20 text-green-500';
      case 'In Progress':
        return 'bg-blue-500/20 text-blue-500';
      case 'Pending':
        return 'bg-yellow-500/20 text-yellow-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-8">Project Management</h1>

      {/* New Project Form - Only visible to authorized roles */}
      {hasProjectManagementAccess(mockUserRole) && (
        <Card className="p-6 bg-[rgba(33,33,43,0.95)] backdrop-blur-md border-white/10">
          <h2 className="text-xl font-semibold mb-6">Add New Project</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Project Name</label>
                <Input
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="Enter project name"
                  className="bg-[rgba(255,255,255,0.05)] border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Client</label>
                <Input
                  value={newProject.client}
                  onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                  placeholder="Enter client name"
                  className="bg-[rgba(255,255,255,0.05)] border-white/10 text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Description</label>
              <Textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                placeholder="Enter project description"
                className="bg-[rgba(255,255,255,0.05)] border-white/10 text-white"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Budget ($)</label>
                <Input
                  type="number"
                  value={newProject.budget}
                  onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                  placeholder="Enter budget amount"
                  className="bg-[rgba(255,255,255,0.05)] border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Due Date</label>
                <Input
                  type="date"
                  value={newProject.dueDate}
                  onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
                  className="bg-[rgba(255,255,255,0.05)] border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Priority</label>
                <Select
                  value={newProject.priority}
                  onValueChange={(value: 'high' | 'medium' | 'low') => 
                    setNewProject({ ...newProject, priority: value })
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
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Assign To (comma-separated usernames)</label>
              <Input
                value={newProject.assignedTo}
                onChange={(e) => setNewProject({ ...newProject, assignedTo: e.target.value })}
                placeholder="E.g., john.doe, jane.smith"
                className="bg-[rgba(255,255,255,0.05)] border-white/10 text-white"
              />
            </div>
            <Button
              onClick={handleAddProject}
              className="bg-gradient-to-r from-[#FF5552] to-[#F62623] hover:opacity-90 text-white"
            >
              Add Project
            </Button>
          </div>
        </Card>
      )}

      {/* Project Tracking */}
      <Card className="p-6 bg-[rgba(33,33,43,0.95)] backdrop-blur-md border-white/10">
        <h2 className="text-xl font-semibold mb-6">Project Tracking</h2>
        <div className="space-y-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-6 bg-[rgba(255,255,255,0.05)] rounded-lg border border-white/10"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-lg">{project.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs ${getPriorityColor(project.priority)}`}>
                      {project.priority} priority
                    </span>
                  </div>
                  <p className="text-gray-400">{project.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} />
                      <span>Due: {project.dueDate}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign size={16} />
                      <span>${project.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users size={16} />
                      <span>{project.assignedTo.join(', ')}</span>
                    </div>
                  </div>
                </div>
                {hasProjectManagementAccess(mockUserRole) && (
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Select
                  value={project.status}
                  onValueChange={(value: Project['status']) => handleUpdateStatus(project.id, value)}
                >
                  <SelectTrigger className="w-[200px] bg-[rgba(255,255,255,0.05)] border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              <div className="mt-4">
                <Progress 
                  value={project.status === 'Completed' ? 100 : project.status === 'In Progress' ? 50 : 0} 
                  className="h-2"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Projects;
