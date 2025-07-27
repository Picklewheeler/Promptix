import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  DollarSign, 
  SendHorizontal, 
  Users, 
  Info, 
  Settings,
  PiggyBank
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/employee/dashboard' },
  { icon: CheckSquare, label: 'Tasks', path: '/employee/tasks' },
  { icon: DollarSign, label: 'Income/Projects', path: '/employee/income-projects' },
  { icon: SendHorizontal, label: 'Requests', path: '/employee/requests' },
  { icon: Users, label: 'Departments', path: '/employee/departments' },
  { icon: PiggyBank, label: 'Budget', path: '/employee/budget' },
  { icon: Users, label: 'Employees', path: '/employee/users', adminOnly: true },
  { icon: Info, label: 'About', path: '/employee/about' },
  { icon: Settings, label: 'Settings', path: '/employee/settings' },
];

// Mock useAuth hook - In a real app, this would come from your authentication context
const useAuth = () => {
  // Replace this with actual logic to determine if the user is an admin
  // For example, checking user roles from a global state or context
  const isAdmin = true; // Set to true for testing admin view, false for regular user
  return { isAdmin };
};

const EmployeePortalLayout: React.FC = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[rgba(33,33,43,0.95)] backdrop-blur-md border-r border-white/10 fixed h-full">
        <div className="p-4 border-b border-white/10">
          <Link to="/employee/dashboard" className="flex items-center space-x-2">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/9de6021644f9415b8e6ba1d1ef4607ce/e4bfb5a3f9037dab7d49b7c2771e5de52593d8aa?placeholderIfAbsent=true"
              className="w-8 h-8"
              alt="Logo"
            />
            <span className="font-semibold text-lg">Promptix Portal</span>
          </Link>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            // Conditionally render admin-only items
            if (item.adminOnly && !isAdmin) {
              return null;
            }
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF5552] to-[#F62623] text-white'
                    : 'hover:bg-white/10 text-gray-300'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default EmployeePortalLayout;
