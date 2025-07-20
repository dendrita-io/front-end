-- This script will be run after user authentication is set up
-- It creates sample data for testing purposes

-- Note: This would typically be run after a user signs up
-- For now, we'll create a placeholder that can be customized per user

-- Sample tags that could be created for a new user
INSERT INTO public.tags (user_id, name, color) VALUES
  -- These will be inserted when a real user signs up
  -- ('user-uuid-here', 'IA', '#3B82F6'),
  -- ('user-uuid-here', 'Machine Learning', '#10B981'),
  -- ('user-uuid-here', 'Estudio', '#F59E0B'),
  -- ('user-uuid-here', 'Tecnología', '#8B5CF6'),
  -- ('user-uuid-here', 'Neurociencia', '#EF4444')
ON CONFLICT (user_id, name) DO NOTHING;

-- Sample notes will be created through the application
-- after user authentication is implemented
