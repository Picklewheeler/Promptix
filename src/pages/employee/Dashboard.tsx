import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  CheckSquare, 
  Briefcase, 
  Users, 
  TrendingUp,
  Clock
} from 'lucide-react';

// Mock data - Replace with actual data from your backend
const mockData = {
  activeTasks: [
    { id: 1, title: 'Design Review', deadline: '2025-07-28', priority: 'High' },
    { id: 2, title: 'Client Meeting', deadline: '2025-07-27', priority: 'Medium' },
    { id: 3, title: 'Bug Fixes', deadline: '2025-07-29', priority: 'Low' },
  ],
  activeProjects: [
    { id: 1, name: 'Website Redesign', progress: 75, deadline: '2025-08-15' },
    { id: 2, name: 'Mobile App', progress: 40, deadline: '2025-09-01' },
    { id: 3, name: 'CRM Integration', progress: 90, deadline: '2025-07-30' },
  ],
  teamMembers: [
    { id: 1, name: 'John Doe', role: 'Lead Developer', avatar: '/avatars/john.jpg' },
    { id: 2, name: 'Jane Smith', role: 'Designer', avatar: '/avatars/jane.jpg' },
    { id: 3, name: 'Mike Johnson', role: 'Project Manager', avatar: '/avatars/mike.jpg' },
  ],
  monthlyStats: {
    completedProjects: 12,
    totalProjects: 15,
    completionRate: 80,
  },
};

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; className?: string }> = ({
  title,
  value,
  icon,
  className = '',
}) => (
  <Card className={`p-6 bg-[rgba(33,33,43,0.95)] backdrop-blur-md border-white/10 ${className}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h3 className="text-2xl font-semibold mt-1 text-white">{value}</h3>
      </div>
      <div className="p-3 bg-[rgba(255,85,82,0.1)] rounded-full">
        {icon}
      </div>
    </div>
  </Card>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Tasks"
          value={mockData.activeTasks.length.toString()}
          icon={<CheckSquare size={24} className="text-[#FF5552]" />}
        />
        <StatCard
          title="Active Projects"
          value={mockData.activeProjects.length.toString()}
          icon={<Briefcase size={24} className="text-[#FF5552]" />}
        />
        <StatCard
          title="Team Members"
          value={mockData.teamMembers.length.toString()}
          icon={<Users size={24} className="text-[#FF5552]" />}
        />
        <StatCard
          title="Completed Projects"
          value={mockData.monthlyStats.completedProjects.toString()}
          icon={<TrendingUp size={24} className="text-[#FF5552]" />}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Tasks */}
        <Card className="p-6 bg-[rgba(33,33,43,0.95)] backdrop-blur-md border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Active Tasks</h2>
            <button className="text-[#FF5552] hover:text-[#F62623] text-sm">View All</button>
          </div>
          <div className="space-y-4">
            {mockData.activeTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Clock size={20} className="text-[#FF5552]" />
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-gray-400">Due: {task.deadline}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs
                  ${task.priority === 'High' ? 'bg-red-500/20 text-red-500' :
                    task.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-green-500/20 text-green-500'}`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Active Projects */}
        <Card className="p-6 bg-[rgba(33,33,43,0.95)] backdrop-blur-md border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Active Projects</h2>
            <button className="text-[#FF5552] hover:text-[#F62623] text-sm">View All</button>
          </div>
          <div className="space-y-6">
            {mockData.activeProjects.map((project) => (
              <div key={project.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{project.name}</p>
                  <span className="text-sm text-gray-400">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
                <p className="text-sm text-gray-400">Deadline: {project.deadline}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Team Members */}
        <Card className="p-6 bg-[rgba(33,33,43,0.95)] backdrop-blur-md border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Team Members</h2>
            <button className="text-[#FF5552] hover:text-[#F62623] text-sm">View All</button>
          </div>
          <div className="space-y-4">
            {mockData.teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center space-x-4 p-3 hover:bg-white/5 rounded-lg transition-colors"
              >
                <Avatar>
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-400">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Monthly Progress */}
        <Card className="p-6 bg-[rgba(33,33,43,0.95)] backdrop-blur-md border-white/10">
          <h2 className="text-xl font-semibold mb-6">Monthly Progress</h2>
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-[#FF5552]">
                <div>
                  <p className="text-3xl font-bold">{mockData.monthlyStats.completionRate}%</p>
                  <p className="text-sm text-gray-400">Completion Rate</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">Projects Completed This Month</p>
              <p className="text-2xl font-semibold mt-1">
                {mockData.monthlyStats.completedProjects} / {mockData.monthlyStats.totalProjects}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
