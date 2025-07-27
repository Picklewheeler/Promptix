import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

const EmployeeLogin: React.FC = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { signIn, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/employee/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error: signInError } = await signIn(loginData.email, loginData.password);
      
      if (signInError) {
        setError(signInError.message);
      } else {
        navigate('/employee/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
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
        
        {error && (
          <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              className="bg-[rgba(255,255,255,0.05)] border-white/10 text-white"
              required
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#FF5552] to-[#F62623] hover:opacity-90 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
        
        <div className="text-center text-sm text-gray-400">
          <p className="mb-2">Demo Credentials:</p>
          <div className="space-y-1 text-xs">
            <p><strong>CEO:</strong> austin.rich@promptix.com | Promptix123</p>
            <p><strong>IT Admin:</strong> dylan.wheeler@promptix.com | Promptix123</p>
            <p><strong>Sales:</strong> tobias.ives@promptix.com | Promptix123</p>
            <p><strong>Designer:</strong> izak.grab@promptix.com | Promptix123</p>
          </div>
        </div>
        
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
