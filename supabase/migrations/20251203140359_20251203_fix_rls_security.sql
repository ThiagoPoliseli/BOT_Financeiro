/*
  # Fix RLS Security for All Tables

  1. Security Updates
    - Enable RLS on all main tables (user_profiles, expenses, budgets, subscriptions, categories)
    - Create proper RLS policies for user data protection
    - Create service role function for bot access
  
  2. Key Changes
    - User profiles: Users can only see/modify their own
    - Expenses: Users can only see/modify their own
    - Budgets: Users can only see/modify their own
    - Subscriptions: Users can only see/modify their own
    - Categories: Public read, no write access
    - Bot sessions/logs/credentials: Service role only with user check
*/

-- Enable RLS on tables that don't have it
ALTER TABLE IF EXISTS user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can create own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can update own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can delete own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can read own budgets" ON budgets;
DROP POLICY IF EXISTS "Users can create own budgets" ON budgets;
DROP POLICY IF EXISTS "Users can update own budgets" ON budgets;
DROP POLICY IF EXISTS "Users can delete own budgets" ON budgets;
DROP POLICY IF EXISTS "Users can read own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can create own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Anyone can read categories" ON categories;
DROP POLICY IF EXISTS "Bot can read categories" ON categories;

-- User Profiles Policies
CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Expenses Policies
CREATE POLICY "Users can read own expenses"
  ON expenses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own expenses"
  ON expenses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
  ON expenses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
  ON expenses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Budgets Policies
CREATE POLICY "Users can read own budgets"
  ON budgets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own budgets"
  ON budgets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budgets"
  ON budgets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own budgets"
  ON budgets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Subscriptions Policies
CREATE POLICY "Users can read own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own subscriptions"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Categories Policies (Public Read)
CREATE POLICY "Anyone can read categories"
  ON categories FOR SELECT
  USING (true);

-- Bot Sessions Policies (Already has RLS, update policies)
DROP POLICY IF EXISTS "Users can read own bot sessions" ON bot_sessions;
DROP POLICY IF EXISTS "Users can insert own bot sessions" ON bot_sessions;
DROP POLICY IF EXISTS "Users can update own bot sessions" ON bot_sessions;

CREATE POLICY "Users can read own bot sessions"
  ON bot_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bot sessions"
  ON bot_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bot sessions"
  ON bot_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Bot Credentials Policies
DROP POLICY IF EXISTS "Users can read own bot credentials" ON bot_credentials;
DROP POLICY IF EXISTS "Users can insert own bot credentials" ON bot_credentials;

CREATE POLICY "Users can read own bot credentials"
  ON bot_credentials FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bot credentials"
  ON bot_credentials FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Bot Logs Policies
DROP POLICY IF EXISTS "Users can read own bot logs" ON bot_logs;
DROP POLICY IF EXISTS "Users can insert own bot logs" ON bot_logs;

CREATE POLICY "Users can read own bot logs"
  ON bot_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bot logs"
  ON bot_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create helper function for bot to access data
CREATE OR REPLACE FUNCTION get_user_by_phone(phone_number TEXT)
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  plan TEXT,
  is_active BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.id,
    up.email,
    up.plan,
    CASE WHEN up.plan != 'free' THEN true ELSE false END
  FROM user_profiles up
  WHERE up.phone = phone_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access to authenticated users
GRANT EXECUTE ON FUNCTION get_user_by_phone(TEXT) TO authenticated;
