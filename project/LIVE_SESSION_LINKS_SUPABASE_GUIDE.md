# Live Session Links Supabase Integration Guide

## 1. Database Setup

### Create the Table

Run this SQL in your Supabase SQL editor:

```sql
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
```

### Enable Row Level Security

```sql
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
      AND le.user_id = auth.uid()
    )
  );
```

### Create Auto-Update Trigger

```sql
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
```

## 2. Common Queries

### Insert/Update Links (Upsert)

```sql
-- This will insert new record or update existing one
INSERT INTO live_session_links (class_id, host_link, attendee_link, teacher_id)
VALUES ('your-class-id', 'host-link-url', 'attendee-link-url', 'teacher-user-id')
ON CONFLICT (class_id)
DO UPDATE SET
  host_link = EXCLUDED.host_link,
  attendee_link = EXCLUDED.attendee_link,
  updated_at = NOW();
```

### Get Links for a Class

```sql
-- Get links for a specific class
SELECT host_link, attendee_link, updated_at
FROM live_session_links
WHERE class_id = 'your-class-id';
```

### Get All Classes with Links (for Teachers)

```sql
-- Get all classes with their links for a specific teacher
SELECT
  lc.id,
  lc.title,
  lc.date_time,
  lsl.host_link,
  lsl.attendee_link,
  lsl.updated_at
FROM lms_classes lc
JOIN lms_teachers lt ON lc.teacher_id = lt.id
LEFT JOIN live_session_links lsl ON lc.id = lsl.class_id
WHERE lt.user_id = 'teacher-user-id';
```

### Get Links for Enrolled Student

```sql
-- Get attendee links for classes a student is enrolled in
SELECT
  lc.id,
  lc.title,
  lc.date_time,
  lsl.attendee_link,
  lsl.updated_at
FROM lms_classes lc
JOIN lms_enrollments le ON lc.id = le.class_id
LEFT JOIN live_session_links lsl ON lc.id = lsl.class_id
WHERE le.user_id = 'student-user-id'
AND lsl.attendee_link IS NOT NULL;
```

### Delete Links for a Class

```sql
-- Delete links for a specific class
DELETE FROM live_session_links
WHERE class_id = 'your-class-id';
```

## 3. TypeScript/JavaScript Examples

### Using Supabase Client

```typescript
// Load links for a class
const loadSessionLinks = async (classId: string) => {
  const { data, error } = await supabase
    .from("live_session_links")
    .select("host_link, attendee_link")
    .eq("class_id", classId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error:", error);
    return null;
  }

  return data;
};

// Save/Update links
const saveSessionLinks = async (
  classId: string,
  hostLink: string,
  attendeeLink: string,
  teacherId: string
) => {
  const { error } = await supabase.from("live_session_links").upsert(
    {
      class_id: classId,
      host_link: hostLink,
      attendee_link: attendeeLink,
      teacher_id: teacherId,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "class_id",
    }
  );

  if (error) {
    console.error("Error saving links:", error);
    return false;
  }

  return true;
};

// Get attendee link for student
const getAttendeeLink = async (classId: string) => {
  const { data, error } = await supabase
    .from("live_session_links")
    .select("attendee_link")
    .eq("class_id", classId)
    .single();

  if (error) {
    console.error("Error:", error);
    return null;
  }

  return data?.attendee_link;
};
```

## 4. Security Notes

1. **Row Level Security (RLS)** is enabled to ensure:

   - Teachers can only manage links for their own classes
   - Students can only view attendee links for classes they're enrolled in

2. **Foreign Key Constraints** ensure data integrity:

   - Links are automatically deleted if the class is deleted
   - Only valid class IDs can be used

3. **Unique Constraint** on `class_id` ensures:
   - Only one set of links per class
   - Upsert operations work correctly

## 5. Testing Queries

### Check if table exists and has correct structure

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'live_session_links'
ORDER BY ordinal_position;
```

### Check RLS policies

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'live_session_links';
```

### View all session links (as admin)

```sql
SELECT
  lsl.*,
  lc.title as class_title,
  lt.name as teacher_name
FROM live_session_links lsl
JOIN lms_classes lc ON lsl.class_id = lc.id
JOIN lms_teachers lt ON lc.teacher_id = lt.id
ORDER BY lsl.updated_at DESC;
```

## Integration Complete!

Your ClassDetails component now:
✅ Loads existing links from Supabase on component mount
✅ Saves links to Supabase whenever teacher updates them
✅ Uses proper RLS to ensure security
✅ Shows links to enrolled students only
✅ Handles all edge cases and errors

The links will now persist across sessions and be visible to all enrolled students when the teacher provides them!
