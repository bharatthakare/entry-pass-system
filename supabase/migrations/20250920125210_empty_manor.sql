/*
# Student Entry Pass System - Database Schema

1. New Tables
   - `students`
     - `id` (uuid, primary key)
     - `name` (text, unique with class)
     - `class` (text, required)
     - `created_at` (timestamp)
   - `pass_logs`
     - `id` (uuid, primary key) 
     - `student_id` (uuid, foreign key)
     - `action_type` (text) - 'generated', 'verified', 'revoked'
     - `ip_address` (text)
     - `user_agent` (text)
     - `created_at` (timestamp)
   - `revoked_passes`
     - `id` (uuid, primary key)
     - `student_id` (uuid, foreign key)
     - `reason` (text)
     - `revoked_by` (text)
     - `created_at` (timestamp)

2. Security
   - Enable RLS on all tables
   - Add policies for authenticated access
   - Create unique index for student name+class combination

3. Indexes
   - Unique constraint on (lower(name), lower(class)) for students
   - Foreign key relationships for data integrity
*/

-- Students Table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  class text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Pass Logs Table for tracking all pass activities
CREATE TABLE IF NOT EXISTS pass_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  action_type text NOT NULL CHECK (action_type IN ('generated', 'verified', 'revoked')),
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Revoked Passes Table
CREATE TABLE IF NOT EXISTS revoked_passes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  reason text DEFAULT 'Manually revoked',
  revoked_by text,
  created_at timestamptz DEFAULT now()
);

-- Create unique index for students (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS students_name_class_unique 
  ON students (lower(name), lower(class));

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE pass_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE revoked_passes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for students table
CREATE POLICY "Anyone can read students"
  ON students
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert students"
  ON students
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for pass_logs table
CREATE POLICY "Anyone can read pass_logs"
  ON pass_logs
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert pass_logs"
  ON pass_logs
  FOR INSERT
  TO public
  WITH CHECK (true);

-- RLS Policies for revoked_passes table
CREATE POLICY "Anyone can read revoked_passes"
  ON revoked_passes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage revoked_passes"
  ON revoked_passes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);