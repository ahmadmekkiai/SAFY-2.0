-- SAFY Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    points INTEGER DEFAULT 0,
    interests TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table (available tasks for users to complete)
CREATE TABLE IF NOT EXISTS tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    points_reward INTEGER NOT NULL DEFAULT 0,
    task_type TEXT NOT NULL, -- 'video', 'survey', 'share', 'profile', etc.
    task_data JSONB, -- flexible data for different task types
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Tasks table (tracks user progress on tasks)
CREATE TABLE IF NOT EXISTS user_tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'claimed'
    progress JSONB, -- flexible progress tracking
    completed_at TIMESTAMP WITH TIME ZONE,
    claimed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, task_id)
);

-- Transactions table (points history)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL, -- positive for earning, negative for spending
    transaction_type TEXT NOT NULL, -- 'task_reward', 'daily_bonus', 'redemption', etc.
    description TEXT,
    metadata JSONB, -- additional data (task_id, reward_id, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ad Campaigns table (advertising campaigns with budget and reward pool)
CREATE TABLE IF NOT EXISTS ad_campaigns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    product_url TEXT,
    category TEXT NOT NULL,  -- Maps to taxonomy (e.g., 'electronics/mobiles/smartphones')
    source TEXT NOT NULL,    -- 'clickflyer', 'pricena', 'jarir', 'noon', 'amazon'
    
    -- Budget & Rewards (Core Business Logic)
    campaign_budget DECIMAL(10,2) NOT NULL,  -- Total budget in SAR paid by brand
    safy_costs DECIMAL(10,2) DEFAULT 0,      -- Platform operational costs
    -- Net profit = campaign_budget - safy_costs (calculated in app logic)
    -- Reward pool = net_profit * 0.70 (70% distributed to users)
    
    -- Campaign Statistics
    status TEXT DEFAULT 'active',  -- 'active', 'paused', 'completed'
    total_views INTEGER DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    total_completions INTEGER DEFAULT 0,
    total_engagement_points INTEGER DEFAULT 0,  -- Sum of all user engagement scores
    
    -- Metadata
    featured BOOLEAN DEFAULT FALSE,
    priority INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- Ad Interactions table (tracks user engagement with campaigns)
CREATE TABLE IF NOT EXISTS ad_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES ad_campaigns(id) ON DELETE CASCADE,
    
    -- Interaction Timeline
    viewed_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    watch_started_at TIMESTAMPTZ,
    watch_completed_at TIMESTAMPTZ,
    watch_duration INTEGER DEFAULT 0,  -- Seconds watched
    
    -- Engagement Metrics
    engagement_score INTEGER DEFAULT 0,  -- 0-100 based on watch time and interactions
    
    -- Reward Distribution
    sar_earned DECIMAL(10,2) DEFAULT 0,     -- User's SAR share from reward pool
    points_earned INTEGER DEFAULT 0,         -- SAR converted to points (1 SAR = 200 Points)
    reward_distributed BOOLEAN DEFAULT FALSE,
    reward_distributed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, campaign_id)  -- One interaction per user per campaign
);

-- Push Notifications table (tracks notifications sent to users)
CREATE TABLE IF NOT EXISTS push_notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES ad_campaigns(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    icon_url TEXT,
    
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    
    status TEXT DEFAULT 'sent'  -- 'sent', 'read', 'clicked', 'dismissed'
);


-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_notifications ENABLE ROW LEVEL SECURITY;


-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Tasks policies (all users can view active tasks)
CREATE POLICY "Anyone can view active tasks"
    ON tasks FOR SELECT
    USING (is_active = TRUE);

-- User Tasks policies
CREATE POLICY "Users can view their own tasks"
    ON user_tasks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
    ON user_tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
    ON user_tasks FOR UPDATE
    USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view their own transactions"
    ON transactions FOR SELECT
    USING (auth.uid() = user_id);

-- Ad Campaigns policies (all users can view active campaigns)
CREATE POLICY "Anyone can view active campaigns"
    ON ad_campaigns FOR SELECT
    USING (status = 'active');

-- Ad Interactions policies
CREATE POLICY "Users can view their own interactions"
    ON ad_interactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interactions"
    ON ad_interactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interactions"
    ON ad_interactions FOR UPDATE
    USING (auth.uid() = user_id);

-- Push Notifications policies
CREATE POLICY "Users can view their own notifications"
    ON push_notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
    ON push_notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- Functions and Triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_tasks_updated_at
    BEFORE UPDATE ON user_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ad_campaigns_updated_at
    BEFORE UPDATE ON ad_campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ad_interactions_updated_at
    BEFORE UPDATE ON ad_interactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_tasks_user_id ON user_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tasks_task_id ON user_tasks(task_id);
CREATE INDEX IF NOT EXISTS idx_user_tasks_status ON user_tasks(status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_is_active ON tasks(is_active);

-- New indexes for ad campaigns
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_status ON ad_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_category ON ad_campaigns(category);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_expires_at ON ad_campaigns(expires_at);
CREATE INDEX IF NOT EXISTS idx_ad_interactions_user_id ON ad_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_ad_interactions_campaign_id ON ad_interactions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_push_notifications_user_id ON push_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_push_notifications_status ON push_notifications(status);

