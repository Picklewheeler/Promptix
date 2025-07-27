<<<<<<< HEAD
import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
=======
import React, { useState } from 'react';
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
>>>>>>> 671489e6df26e438c3876e2537dc9cfe9bede4c9
import { 
  LayoutDashboard, 
  CheckSquare, 
  DollarSign, 
  SendHorizontal, 
  Users, 
  Info, 
  Settings,
  PiggyBank,
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/employee/dashboard' },
  { icon: CheckSquare, label: 'Tasks', path: '/employee/tasks' },
  { icon: DollarSign, label: 'Projects', path: '/employee/income-projects' },
  { icon: SendHorizontal, label: 'Requests', path: '/employee/requests' },
  { icon: Users, label: 'Departments', path: '/employee/departments', adminOnly: true },
  { icon: PiggyBank, label: 'Budget', path: '/employee/budget' },
  { icon: Users, label: 'Employees', path: '/employee/users', adminOnly: true },
  { icon: Settings, label: 'Settings', path: '/employee/settings' },
];

const EmployeePortalLayout: React.FC = () => {
<<<<<<< HEAD
  const { isAdmin } = useAuth();
=======
  const location = useLocation();
  const { profile, isAdmin, signOut, loading, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
>>>>>>> 671489e6df26e438c3876e2537dc9cfe9bede4c9

  // Redirect to login if not authenticated
  if (!loading && !user) {
    return <Navigate to="/employee/login" replace />;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
      // Optionally show a toast notification to the user
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D] text-white flex relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 bg-gradient-to-b from-[rgba(33,33,43,0.95)] to-[rgba(20,20,30,0.95)] 
        backdrop-blur-md border-r border-white/10 fixed h-full z-50 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <Link to="/employee/dashboard" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-r from-[#FF5552] to-[#F62623] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="font-semibold text-lg group-hover:text-[#FF5552] transition-colors duration-200">
                Promptix Portal
              </span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:bg-white/10"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </Button>
          </div>
        </div>
<<<<<<< HEAD
        <nav className="p-4 space-y-2">
          {navItems
            .filter((item) => !item.adminOnly || isAdmin)
            .map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-[#FF5552] to-[#F62623] text-white'
                        : 'hover:bg-white/10 text-gray-300'
                    }`
                  }
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
=======

        {/* User Profile Section */}
        <div className="p-4 border-b border-white/10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-2 h-auto hover:bg-white/10">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback className="bg-gradient-to-r from-[#FF5552] to-[#F62623] text-white">
                      {profile?.full_name?.split(' ').map(n => n[0]).join('') || '??'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-white truncate">
                      {profile?.full_name || 'Unknown User'}
                    </p>
                    <p className="text-xs text-gray-400 capitalize truncate">
                      {profile?.role?.replace('_', ' ') || 'Employee'}
                    </p>
                  </div>
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#1A1A1A] border-white/10" align="start">
              <DropdownMenuItem asChild>
                <Link to="/employee/settings" className="flex items-center cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-400 focus:text-red-300 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            if (item.adminOnly && !isAdmin) {
              return null;
            }
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive
                    ? 'bg-gradient-to-r from-[#FF5552] to-[#F62623] text-white shadow-lg shadow-red-500/25 scale-105'
                    : 'hover:bg-white/10 text-gray-300 hover:text-white hover:scale-102'
                  }
                `}
              >
                <Icon size={20} className={`transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'}`} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
>>>>>>> 671489e6df26e438c3876e2537dc9cfe9bede4c9
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden bg-[rgba(33,33,43,0.95)] backdrop-blur-md border-b border-white/10 p-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </Button>
            <span className="font-semibold text-lg">Promptix Portal</span>
            <div className="w-8" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default EmployeePortalLayout;
