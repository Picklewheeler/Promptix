import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { User, UserRole, Department } from '@/lib/users';
import { Shield, UserPlus, Users as UsersIcon } from 'lucide-react';

// Mock current user role - In production, this would come from your auth system
const mockUserRole: UserRole = 'executive';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<Partial<User>>({
    fullName: '',
    username: '',
    email: '',
    role: 'employee',
    department: 'IT/Infrastructure',
    rank: '',
  });

  const departments: Department[] = [
    'Executive',
    'IT/Infrastructure',
    'Sales',
    'Design & Development'
  ];

  const roles: { value: UserRole; label: string }[] = [
    { value: 'executive', label: 'Executive' },
    { value: 'systems_admin', label: 'Systems Administrator' },
    { value: 'it_manager', label: 'IT Manager' },
    { value: 'sales', label: 'Sales' },
    { value: '3d_modeler', label: '3D Modeler' },
    { value: 'employee', label: 'Employee' }
  ];

  const handleAddUser = () => {
    if (!newUser.fullName || !newUser.username) return;

    const user: User = {
      id: (users.length + 1).toString(),
      fullName: newUser.fullName,
      username: newUser.username,
      email: newUser.email || `${newUser.username.toLowerCase()}@promptix.com`,
      role: newUser.role as UserRole || 'employee',
      department: newUser.department as Department,
      rank: newUser.rank || 'Employee',
      isActive: true,
      created_at: new Date().toISOString(),
    };

    setUsers([...users, user]);
    setNewUser({
      fullName: '',
      username: '',
      email: '',
      role: 'employee',
      department: 'IT/Infrastructure',
      rank: '',
    });
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'executive':
        return 'bg-purple-500/20 text-purple-500';
      case 'systems_admin':
      case 'it_manager':
        return 'bg-blue-500/20 text-blue-500';
      case 'sales':
        return 'bg-green-500/20 text-green-500';
      case '3d_modeler':
        return 'bg-yellow-500/20 text-yellow-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-8">Employee Management</h1>

      {/* Add New User Form */}
      <Card className="p-6 bg-[rgba(33,33,43,0.95)] backdrop-blur-md border-white/10">
        <div className="flex items-center gap-2 mb-6">
          <UserPlus className="w-6 h-6 text-[#FF5552]" />
          <h2 className="text-xl font-semibold">Add New Employee</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Full Name</label>
              <Input
                value={newUser.fullName}
                onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                className="bg-[rgba(255,255,255,0.05)] border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Username</label>
              <Input
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="bg-[rgba(255,255,255,0.05)] border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Password</label>
              <Input
                type="password"
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="bg-[rgba(255,255,255,0.05)] border-white/10 text-white"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Email</label>
              <Input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="bg-[rgba(255,255,255,0.05)] border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Department</label>
              <Select
                value={newUser.department}
                onValueChange={(value: Department) => setNewUser({ ...newUser, department: value })}
              >
                <SelectTrigger className="bg-[rgba(255,255,255,0.05)] border-white/10 text-white">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Role</label>
              <Select
                value={newUser.role}
                onValueChange={(value: UserRole) => setNewUser({ ...newUser, role: value })}
              >
                <SelectTrigger className="bg-[rgba(255,255,255,0.05)] border-white/10 text-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Rank/Position</label>
              <Input
                value={newUser.rank}
                onChange={(e) => setNewUser({ ...newUser, rank: e.target.value })}
                className="bg-[rgba(255,255,255,0.05)] border-white/10 text-white"
              />
            </div>
          </div>
        </div>
        <Button
          onClick={handleAddUser}
          className="mt-6 bg-gradient-to-r from-[#FF5552] to-[#F62623] hover:opacity-90 text-white"
        >
          Add Employee
        </Button>
      </Card>

      {/* Employee List */}
      <Card className="p-6 bg-[rgba(33,33,43,0.95)] backdrop-blur-md border-white/10">
        <div className="flex items-center gap-2 mb-6">
          <UsersIcon className="w-6 h-6 text-[#FF5552]" />
          <h2 className="text-xl font-semibold">Employee List</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#FF5552] flex items-center justify-center text-white font-semibold">
                          {user.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{user.fullName}</div>
                        <div className="text-sm text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getRoleBadgeColor(user.role)}`}>
                      {roles.find(r => r.value === user.role)?.label || user.role}
                    </span>
                  </TableCell>
                  <TableCell>{user.rank}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.isActive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default Users;
