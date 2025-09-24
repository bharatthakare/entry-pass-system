"use client";

import React, { useState } from "react";
import { StudentForm } from "@/components/StudentForm";
import { PassCard } from "@/components/PassCard";
import { AdminModal } from "@/components/AdminModal";
import { Student } from "@/lib/supabase";
import { GraduationCap, RefreshCw, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [student, setStudent] = useState<Student | null>(null);

  const handleStudentFound = (foundStudent: Student) => {
    setStudent(foundStudent);
  };

  const handleStartOver = () => {
    setStudent(null);
  };

  const handleAdminLogin = () => {
    // Admin login successful - could trigger a refresh or update UI
    console.log("Admin logged in successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                DEPARTMENT OF MATHEMATICS
              </h1>
              <p className="text-sm text-gray-600">ASSOCIATION ENTRY PASS</p>
            </div>
          </div>
          <AdminModal onAdminLogin={handleAdminLogin} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {!student ? (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">
                Welcome to Entry Pass System
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Generate your digital entry pass for the College Event on{" "}
                <span className="font-semibold text-blue-600">
                  September 30, 2025
                </span>
              </p>
            </div>

            <StudentForm onStudentFound={handleStudentFound} />

            <div className="text-center text-sm text-gray-500">
              <p>
                Your pass will include a QR code for quick verification at the
                entrance.
              </p>
              <p className="mt-1">
                Don't see your name? Contact the admin to be added to the
                system.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">
                Your Entry Pass is Ready!
              </h2>
              <p className="text-lg text-gray-600">
                Save this pass and present it at the entrance on event day
              </p>
            </div>

            <PassCard student={student} />

            <Button
              onClick={handleStartOver}
              variant="outline"
              className="mt-6"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate Another Pass
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
  <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-600">
    <p className="text-sm">
      © 2025 College Entry Pass System. Secure digital passes for events.
    </p>
    <p className="mt-2 text-lg font-bold text-gray-900">
      Developed by Bharat Thakare
    </p>
    <div className="mt-2 flex justify-center items-center space-x-2">
      <Globe className="w-5 h-5 text-gray-700" />
      <a
        href="https://bharatthakare.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        bharatthakare.vercel.app
      </a>
    </div>
  </div>
</footer>
    </div>
  );
}
