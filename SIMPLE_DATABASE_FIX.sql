-- SIMPLE FIX: Remove foreign key constraint to allow reports without users table
-- This allows fraud reports to be created using auth.uid() directly
-- Run this in Supabase SQL Editor

-- Step 1: Drop the problematic foreign key constraint
ALTER TABLE public.fraud_reports 
DROP CONSTRAINT IF EXISTS fraud_reports_user_id_fkey;

-- Step 2: Create a simple RLS policy for fraud_reports that uses auth.uid() directly
DROP POLICY IF EXISTS "Users can create their own reports" ON public.fraud_reports;
DROP POLICY IF EXISTS "Users can view their own reports" ON public.fraud_reports;
DROP POLICY IF EXISTS "Anyone can view public reports" ON public.fraud_reports;

-- Allow users to create reports using their auth.uid()
CREATE POLICY "Authenticated users can create reports" ON public.fraud_reports
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Allow users to view their own reports
CREATE POLICY "Users can view their own reports" ON public.fraud_reports
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Allow viewing of public reports
CREATE POLICY "Anyone can view public reports" ON public.fraud_reports
    FOR SELECT USING (is_public = true);

-- Step 3: Make user_id reference the auth.users table instead
-- This way it uses the built-in Supabase auth system
ALTER TABLE public.fraud_reports 
ADD CONSTRAINT fraud_reports_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Done! Now reports can be created using auth.uid() without requiring a custom users table
