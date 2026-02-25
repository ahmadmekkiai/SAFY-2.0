'use server';

import { createClient } from '@/lib/supabase/server';
import { getCampaignsByInterests, getCampaignById, type AdCampaign } from '@/lib/mockCampaigns';
import {
    calculateEngagementScore,
    calculateCompleteReward,
    type EngagementMetrics
} from '@/lib/rewardCalculation';
import { addPoints } from './points';

/**
 * Get personalized campaigns based on user's interests
 * Excludes campaigns the user has already completed
 */
export async function getPersonalizedCampaigns(userId: string) {
    try {
        const supabase = await createClient();

        // Fetch user's interests
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('interests')
            .eq('id', userId)
            .single();

        if (profileError || !profile) {
            console.error('Error fetching user profile:', profileError);
            return { success: false, campaigns: [], error: 'Failed to fetch profile' };
        }

        const interests = profile.interests || [];

        // Get campaigns matching user interests
        const allCampaigns = getCampaignsByInterests(interests);

        // Fetch user's completed campaigns
        const { data: interactions } = await supabase
            .from('ad_interactions')
            .select('campaign_id')
            .eq('user_id', userId)
            .eq('reward_distributed', true);

        const completedCampaignIds = new Set(
            interactions?.map((i: { campaign_id: string }) => i.campaign_id) || []
        );

        // Filter out completed campaigns
        const availableCampaigns = allCampaigns.filter(
            campaign => !completedCampaignIds.has(campaign.id)
        );

        return {
            success: true,
            campaigns: availableCampaigns,
            totalCampaigns: availableCampaigns.length
        };
    } catch (error) {
        console.error('Error in getPersonalizedCampaigns:', error);
        return { success: false, campaigns: [], error: 'An unexpected error occurred' };
    }
}

/**
 * Track when a user views a campaign
 */
export async function trackCampaignView(userId: string, campaignId: string) {
    try {
        const supabase = await createClient();

        // Check if interaction already exists
        const { data: existing } = await supabase
            .from('ad_interactions')
            .select('id')
            .eq('user_id', userId)
            .eq('campaign_id', campaignId)
            .single();

        if (existing) {
            // Update viewed_at if not already set
            await supabase
                .from('ad_interactions')
                .update({ viewed_at: new Date().toISOString() })
                .eq('id', existing.id)
                .is('viewed_at', null);
        } else {
            // Create new interaction
            await supabase
                .from('ad_interactions')
                .insert({
                    user_id: userId,
                    campaign_id: campaignId,
                    viewed_at: new Date().toISOString()
                });
        }

        return { success: true };
    } catch (error) {
        console.error('Error tracking campaign view:', error);
        return { success: false, error: 'Failed to track view' };
    }
}

/**
 * Track when a user clicks "Watch Ad to Earn"
 */
export async function trackCampaignClick(userId: string, campaignId: string) {
    try {
        const supabase = await createClient();

        // Update or create interaction
        const { data: existing } = await supabase
            .from('ad_interactions')
            .select('id')
            .eq('user_id', userId)
            .eq('campaign_id', campaignId)
            .single();

        if (existing) {
            await supabase
                .from('ad_interactions')
                .update({ clicked_at: new Date().toISOString() })
                .eq('id', existing.id);
        } else {
            await supabase
                .from('ad_interactions')
                .insert({
                    user_id: userId,
                    campaign_id: campaignId,
                    clicked_at: new Date().toISOString()
                });
        }

        return { success: true };
    } catch (error) {
        console.error('Error tracking campaign click:', error);
        return { success: false, error: 'Failed to track click' };
    }
}

/**
 * Start ad watch session
 * Returns campaign details for the ad player
 */
export async function startAdWatch(userId: string, campaignId: string) {
    try {
        const supabase = await createClient();
        const campaign = getCampaignById(campaignId);

        if (!campaign) {
            return { success: false, error: 'Campaign not found' };
        }

        // Update interaction with watch start time
        const { data: existing } = await supabase
            .from('ad_interactions')
            .select('id')
            .eq('user_id', userId)
            .eq('campaign_id', campaignId)
            .single();

        if (existing) {
            await supabase
                .from('ad_interactions')
                .update({ watch_started_at: new Date().toISOString() })
                .eq('id', existing.id);
        } else {
            await supabase
                .from('ad_interactions')
                .insert({
                    user_id: userId,
                    campaign_id: campaignId,
                    watch_started_at: new Date().toISOString()
                });
        }

        return {
            success: true,
            campaign
        };
    } catch (error) {
        console.error('Error starting ad watch:', error);
        return { success: false, error: 'Failed to start ad watch' };
    }
}

/**
 * Complete ad watch and distribute reward
 * This is the CORE reward distribution logic
 */
export async function completeAdWatch(
    userId: string,
    campaignId: string,
    watchDuration: number,  // Seconds watched
    interactions: number = 0  // Number of user interactions
) {
    try {
        const supabase = await createClient();
        const campaign = getCampaignById(campaignId);

        if (!campaign) {
            return { success: false, error: 'Campaign not found' };
        }

        // Calculate engagement score
        const metrics: EngagementMetrics = {
            watchDuration,
            requiredDuration: 30,  // 30 seconds required
            interactions
        };
        const engagementScore = calculateEngagementScore(metrics);

        // Get current total engagement points for this campaign
        // In a real implementation, this would be from the database
        // For now, we'll use a simple calculation
        const totalEngagementPoints = campaign.totalEngagementPoints + engagementScore;

        // Calculate user's reward
        const reward = calculateCompleteReward(
            {
                campaignBudget: campaign.campaignBudget,
                safyCosts: campaign.safyCosts
            },
            engagementScore,
            totalEngagementPoints
        );

        // Update interaction record
        const { data: interaction } = await supabase
            .from('ad_interactions')
            .select('id')
            .eq('user_id', userId)
            .eq('campaign_id', campaignId)
            .single();

        if (interaction) {
            await supabase
                .from('ad_interactions')
                .update({
                    watch_completed_at: new Date().toISOString(),
                    watch_duration: watchDuration,
                    engagement_score: engagementScore,
                    sar_earned: reward.sarEarned,
                    points_earned: reward.pointsEarned,
                    reward_distributed: true,
                    reward_distributed_at: new Date().toISOString()
                })
                .eq('id', interaction.id);
        }

        // Add points to user's wallet (addPoints takes userId + SAR amount)
        await addPoints(userId, reward.sarEarned);

        return {
            success: true,
            reward: {
                engagementScore,
                sarEarned: reward.sarEarned,
                pointsEarned: reward.pointsEarned,
                rewardPool: reward.rewardPool
            }
        };
    } catch (error) {
        console.error('Error completing ad watch:', error);
        return { success: false, error: 'Failed to complete ad watch' };
    }
}

/**
 * Get user's ad interaction history
 */
export async function getUserAdHistory(userId: string) {
    try {
        const supabase = await createClient();

        const { data: interactions, error } = await supabase
            .from('ad_interactions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching ad history:', error);
            return { success: false, history: [], error: 'Failed to fetch history' };
        }

        return {
            success: true,
            history: interactions || []
        };
    } catch (error) {
        console.error('Error in getUserAdHistory:', error);
        return { success: false, history: [], error: 'An unexpected error occurred' };
    }
}
