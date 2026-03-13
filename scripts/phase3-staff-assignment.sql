-- Phase 3: Add staff-to-table assignment
-- Run this in Supabase SQL Editor

-- Add assigned_staff_id column to restaurant_tables
ALTER TABLE restaurant_tables
ADD COLUMN IF NOT EXISTS assigned_staff_id UUID REFERENCES staff(id) ON DELETE SET NULL;

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_restaurant_tables_assigned_staff
ON restaurant_tables(assigned_staff_id) WHERE assigned_staff_id IS NOT NULL;
