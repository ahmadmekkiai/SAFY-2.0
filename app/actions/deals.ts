'use server';

import { createClient } from '@/lib/supabase/server';
import { getDealsByInterests, type Deal } from '@/lib/mockDeals';

/**
 * Get personalized deals based on user's interests
 */
export async function getPersonalizedDeals(userId: string) {
    try {
        const supabase = await createClient();

        // Fetch user's interests
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('interests')
            .eq('id', userId)
            .single();

        if (error || !profile) {
            console.error('Error fetching user profile:', error);
            return { success: false, deals: [], error: 'Failed to fetch profile' };
        }

        const interests = profile.interests || [];

        // Get deals matching user interests
        const deals = getDealsByInterests(interests);

        return {
            success: true,
            deals,
            totalDeals: deals.length
        };
    } catch (error) {
        console.error('Error in getPersonalizedDeals:', error);
        return { success: false, deals: [], error: 'An unexpected error occurred' };
    }
}

/**
 * Track when a user views an ad (for future analytics)
 */
export async function trackAdView(userId: string, dealId: string) {
    try {
        // In a real implementation, this would log to an analytics table
        console.log(`User ${userId} viewed deal ${dealId}`);

        return { success: true };
    } catch (error) {
        console.error('Error tracking ad view:', error);
        return { success: false, error: 'Failed to track view' };
    }
}

/**
 * Track when a user clicks "Watch Ad to Earn"
 */
export async function trackAdClick(userId: string, dealId: string) {
    try {
        // In a real implementation, this would:
        // 1. Log the click
        // 2. Initiate the ad viewing session
        // 3. Prepare for reward distribution
        console.log(`User ${userId} clicked to watch ad ${dealId}`);

        return { success: true };
    } catch (error) {
        console.error('Error tracking ad click:', error);
        return { success: false, error: 'Failed to track click' };
    }
}
