'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, UserPlus, Users } from 'lucide-react';
import { signInAdmin, isAdminLoggedIn, logoutAdmin } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

interface AdminModalProps {
  onAdminLogin: () => void;
}

export function AdminModal({ onAdminLogin }: AdminModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [studentForm, setStudentForm] = useState({ name: '', class: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    setIsLoggedIn(isAdminLoggedIn());
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signInAdmin(loginForm.username, loginForm.password);
    if (result.success) {
      setIsLoggedIn(true);
      onAdminLogin();
      setSuccess('Login successful!');
    } else {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase
        .from('students')
        .insert({
          name: studentForm.name.trim(),
          class: studentForm.class.trim(),
        });

      if (error) {
        if (error.code === '23505') {
          setError('Student with this name and class already exists');
        } else {
          setError(error.message);
        }
      } else {
        setSuccess('Student added successfully!');
        setStudentForm({ name: '', class: '' });
      }
    } catch (err) {
      setError('Failed to add student');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsLoggedIn(false);
    setIsOpen(false);
    setSuccess('');
    setError('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Shield className="w-4 h-4 mr-2" />
          Admin Panel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Admin Panel</span>
          </DialogTitle>
        </DialogHeader>

        {!isLoggedIn ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={loginForm.username}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, username: e.target.value })
                }
                placeholder="Enter admin username"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                placeholder="Enter admin password"
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <Alert>
              <Users className="w-4 h-4" />
              <AlertDescription>
                Welcome, Admin! You can now add new students to the system.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <Label htmlFor="studentName">Student Name</Label>
                <Input
                  id="studentName"
                  type="text"
                  value={studentForm.name}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, name: e.target.value })
                  }
                  placeholder="Enter student name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="studentClass">Class</Label>
                <Input
                  id="studentClass"
                  type="text"
                  value={studentForm.class}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, class: e.target.value })
                  }
                  placeholder="e.g., 12th Grade A"
                  required
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                <UserPlus className="w-4 h-4 mr-2" />
                {loading ? 'Adding...' : 'Add Student'}
              </Button>
            </form>

            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full"
            >
              Logout
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}