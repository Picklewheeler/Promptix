import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const EmployeeLogin: React.FC = () => {
  const [loginData, setLoginData] = useState({
    emailOrUsername: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual authentication
    // For now, just navigate to dashboard
    navigate('/employee/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
      <div className="absolute inset-0 z-0">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/9de6021644f9415b8e6ba1d1ef4607ce/d527bd6bc2f45786143bfd81a1bf4f624e00cbfb?placeholderIfAbsent=true"
          className="w-full h-full object-cover opacity-50"
          alt="Background"
        />
      </div>
      <Card className="w-full max-w-md p-8 space-y-6 relative z-10 bg-[rgba(33,33,43,0.95)] backdrop-blur-md border-white/10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Employee Portal</h1>
          <p className="text-gray-400">Sign in to access your dashboard</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Email or Username</label>
            <Input
              type="text"
              placeholder="Enter your email or username"
              value={loginData.emailOrUsername}
              onChange={(e) => setLoginData({ ...loginData, emailOrUsername: e.target.value })}
              className="bg-[rgba(255,255,255,0.05)] border-white/10 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Password</label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              className="bg-[rgba(255,255,255,0.05)] border-white/10 text-white"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#FF5552] to-[#F62623] hover:opacity-90 text-white"
          >
            Sign In
          </Button>
        </form>
        <p className="text-center text-sm text-gray-400">
          Forgot your password?{' '}
          <a href="#" className="text-[#FF5552] hover:underline">
            Reset it here
          </a>
        </p>
      </Card>
    </div>
  );
};

export default EmployeeLogin;
