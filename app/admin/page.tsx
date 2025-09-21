"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Activity, Shield, ArrowLeft } from "lucide-react";
import { isAdminLoggedInLocal, logoutAdmin } from "@/lib/auth";
import { supabase, Student, PassLog } from "@/lib/supabase";
import Link from "next/link";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [passLogs, setPassLogs] = useState<PassLog[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    passesGenerated: 0,
    passesVerified: 0,
  });

  // ✅ updated: async check for Supabase session + admin record
  useEffect(() => {
    setIsAuthenticated(isAdminLoggedInLocal());
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      // Fetch students
      const { data: studentsData } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });

      // Fetch pass logs
      const { data: logsData } = await supabase
        .from("pass_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      setStudents(studentsData || []);
      setPassLogs(logsData || []);

      // Calculate stats
      const totalStudents = studentsData?.length || 0;
      const passesGenerated =
        logsData?.filter((log) => log.action_type === "generated").length || 0;
      const passesVerified =
        logsData?.filter((log) => log.action_type === "verified").length || 0;

      setStats({
        totalStudents,
        passesGenerated,
        passesVerified,
      });
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  // ✅ updated: logout is async
  const handleLogout = async () => {
    await logoutAdmin();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Shield className="w-6 h-6 text-red-500" />
              <span>Access Denied</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Please login through the main page to access the admin dashboard.
            </p>
            <Link href="/">
              <Button className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Main Page
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Entry Pass System Management
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Main Page
              </Button>
            </Link>
            <Button onClick={handleLogout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Passes Generated
              </CardTitle>
              <Activity className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.passesGenerated}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Passes Verified
              </CardTitle>
              <Activity className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.passesVerified}</div>
            </CardContent>
          </Card>
        </div>

        {/* Students List */}
        <Card>
          <CardHeader>
            <CardTitle>Registered Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {students.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No students registered yet.
                </p>
              ) : (
                students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">{student.name}</p>
                      <p className="text-sm text-gray-600">{student.class}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Added:{" "}
                        {new Date(student.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {passLogs.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No activity logged yet.
                </p>
              ) : (
                passLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Badge
                        variant={
                          log.action_type === "generated"
                            ? "default"
                            : log.action_type === "verified"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {log.action_type}
                      </Badge>
                      <span className="text-sm">
                        Student ID: {log.student_id?.slice(0, 8)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
