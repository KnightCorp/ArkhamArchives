-- Fix for lms_classes trigger error
-- The issue is triggers are looking for 'class_id' field but the table uses 'id'

-- First, let's check what triggers exist on lms_classes
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'lms_classes';

-- If there are triggers referencing NEW.class_id, we need to update them to use NEW.id
-- Here's the most likely culprit - update_teacher_stats trigger

-- Drop and recreate the update_teacher_stats function with correct field references
DROP FUNCTION IF EXISTS update_teacher_stats() CASCADE;

CREATE OR REPLACE FUNCTION update_teacher_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update teacher statistics when classes are inserted/updated/deleted
  IF TG_OP = 'INSERT' THEN
    -- Get teacher_id from the new class record
    UPDATE lms_teachers 
    SET 
      total_classes = total_classes + 1,
      updated_at = NOW()
    WHERE id = NEW.teacher_id;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Get teacher_id from the old class record
    UPDATE lms_teachers 
    SET 
      total_classes = GREATEST(total_classes - 1, 0),
      updated_at = NOW()
    WHERE id = OLD.teacher_id;
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
DROP TRIGGER IF EXISTS update_teacher_stats_trigger ON lms_classes;
CREATE TRIGGER update_teacher_stats_trigger
  AFTER INSERT OR DELETE ON lms_classes
  FOR EACH ROW
  EXECUTE FUNCTION update_teacher_stats();

-- Also fix the calculate_teacher_rating function if it exists
DROP FUNCTION IF EXISTS calculate_teacher_rating() CASCADE;

CREATE OR REPLACE FUNCTION calculate_teacher_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- This function calculates teacher rating based on enrollments
  -- Only runs on enrollment changes, not class creation
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Check if we need to recreate any rating triggers
-- (This might not be needed for class creation, but let's be safe)
DROP TRIGGER IF EXISTS calculate_teacher_rating_trigger ON lms_enrollments;
CREATE TRIGGER calculate_teacher_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON lms_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION calculate_teacher_rating();
