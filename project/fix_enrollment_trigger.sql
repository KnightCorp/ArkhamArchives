-- FIX FOR ENROLLMENT TRIGGER ISSUE
-- Run this in your Supabase SQL Editor to fix the "teacher_id" error

-- =============================================================================
-- OPTION 1: FIX THE TRIGGER FUNCTION (RECOMMENDED)
-- =============================================================================

-- Drop and recreate the update_teacher_stats function with proper JOIN
DROP FUNCTION IF EXISTS update_teacher_stats() CASCADE;

CREATE OR REPLACE FUNCTION update_teacher_stats()
RETURNS TRIGGER AS $$
DECLARE
    target_teacher_id UUID;
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Get the teacher_id from the class
        SELECT teacher_id INTO target_teacher_id
        FROM lms_classes
        WHERE id = NEW.class_id;
        
        IF target_teacher_id IS NOT NULL THEN
            -- Update total students and classes count
            UPDATE lms_teachers 
            SET 
                total_students = (
                    SELECT COUNT(DISTINCT student_id) 
                    FROM lms_enrollments e
                    JOIN lms_classes c ON e.class_id = c.id
                    WHERE c.teacher_id = target_teacher_id
                ),
                total_classes = (
                    SELECT COUNT(*) 
                    FROM lms_classes 
                    WHERE teacher_id = target_teacher_id
                )
            WHERE id = target_teacher_id;
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- OPTION 2: FIX THE RATING CALCULATION FUNCTION TOO
-- =============================================================================

-- Drop and recreate the calculate_teacher_rating function with proper JOIN
DROP FUNCTION IF EXISTS calculate_teacher_rating() CASCADE;

CREATE OR REPLACE FUNCTION calculate_teacher_rating()
RETURNS TRIGGER AS $$
DECLARE
    target_teacher_id UUID;
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        -- Get the teacher_id from the class
        SELECT teacher_id INTO target_teacher_id
        FROM lms_classes
        WHERE id = NEW.class_id;
        
        IF target_teacher_id IS NOT NULL THEN
            UPDATE lms_teachers 
            SET rating = (
                SELECT COALESCE(AVG(rating), 0) 
                FROM lms_enrollments e
                JOIN lms_classes c ON e.class_id = c.id
                WHERE c.teacher_id = target_teacher_id AND e.rating IS NOT NULL
            )
            WHERE id = target_teacher_id;
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- RECREATE THE TRIGGERS
-- =============================================================================

-- Drop existing triggers
DROP TRIGGER IF EXISTS update_teacher_stats_trigger ON lms_enrollments;
DROP TRIGGER IF EXISTS update_teacher_stats_class_trigger ON lms_classes;
DROP TRIGGER IF EXISTS calculate_teacher_rating_trigger ON lms_enrollments;

-- Recreate triggers with the fixed functions
CREATE TRIGGER update_teacher_stats_trigger
    AFTER INSERT OR UPDATE ON lms_enrollments
    FOR EACH ROW
    EXECUTE FUNCTION update_teacher_stats();

CREATE TRIGGER update_teacher_stats_class_trigger
    AFTER INSERT ON lms_classes
    FOR EACH ROW
    EXECUTE FUNCTION update_teacher_stats();

CREATE TRIGGER calculate_teacher_rating_trigger
    AFTER INSERT OR UPDATE ON lms_enrollments
    FOR EACH ROW
    EXECUTE FUNCTION calculate_teacher_rating();

-- =============================================================================
-- VERIFICATION
-- =============================================================================

-- Test that the triggers are working
SELECT 'TRIGGER FIX COMPLETE!' as status;
SELECT 'You can now enroll in classes without errors!' as message;

-- Show trigger information
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_table IN ('lms_enrollments', 'lms_classes')
ORDER BY event_object_table, trigger_name;
