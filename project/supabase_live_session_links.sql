-- Create table for storing live session links
CREATE TABLE IF NOT EXISTS live_session_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID NOT NULL,
  host_link TEXT,
  attendee_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  teacher_id UUID NOT NULL,
  
  -- Foreign key constraint (assuming you have lms_classes table)
  CONSTRAINT fk_live_session_class FOREIGN KEY (class_id) REFERENCES lms_classes(id) ON DELETE CASCADE,
  
  -- Ensure one record per class
  UNIQUE(class_id)
);

-- Enable RLS (Row Level Security)
ALTER TABLE live_session_links ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Teachers can insert/update/select their own class links
CREATE POLICY "Teachers can manage their class links" ON live_session_links
  FOR ALL USING (
    teacher_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM lms_classes lc 
      JOIN lms_teachers lt ON lc.teacher_id = lt.id 
      WHERE lc.id = class_id AND lt.user_id = auth.uid()
    )
  );

-- Students can only view links for classes they're enrolled in
CREATE POLICY "Students can view links for enrolled classes" ON live_session_links
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM lms_enrollments le 
      WHERE le.class_id = live_session_links.class_id 
      AND le.student_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_live_session_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS update_live_session_links_updated_at ON live_session_links;
CREATE TRIGGER update_live_session_links_updated_at
  BEFORE UPDATE ON live_session_links
  FOR EACH ROW
  EXECUTE FUNCTION update_live_session_links_updated_at();

-- Grant permissions
GRANT ALL ON live_session_links TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
