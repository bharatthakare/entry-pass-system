"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, AlertCircle } from "lucide-react";
import { supabase, Student } from "@/lib/supabase";

interface StudentFormProps {
  onStudentFound: (student: Student) => void;
}

export function StudentForm({ onStudentFound }: StudentFormProps) {
  const [form, setForm] = useState({ name: "", class: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data: students, error } = await supabase
        .from("students")
        .select("*")
        .ilike("name", form.name.trim())
        .ilike("class", form.class.trim())
        .limit(1);

      if (error) {
        setError("Database error occurred");
        return;
      }

      if (!students || students.length === 0) {
        setError(
          "Student not found. Please check your name and class, or contact admin."
        );
        return;
      }

      // Log pass generation
      await supabase.from("pass_logs").insert({
        student_id: students[0].id,
        action_type: "generated",
        ip_address: "client", // In production, get real IP
        user_agent: navigator.userAgent,
      });

      onStudentFound(students[0]);
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
          Generate Entry Pass
        </CardTitle>
        <p className="text-gray-600">Enter your details to get your pass</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Student Name</Label>
            <Input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <Label htmlFor="class">Class</Label>
            <Input
              id="class"
              type="text"
              value={form.class}
              onChange={(e) => setForm({ ...form, class: e.target.value })}
              placeholder="e.g., BSC MATH III"
              required
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
            disabled={loading}
          >
            <Search className="w-4 h-4 mr-2" />
            {loading ? "Searching..." : "Generate Pass"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
