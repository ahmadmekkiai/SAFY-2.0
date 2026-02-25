'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * Send push notification for a new campaign
 */
export async function sendCampaignNotification(
    userId: string,
    campaignId: string,
    title: string,
    body: string
) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('push_notifications')
            .insert({
                user_id: userId,
                campaign_id: campaignId,
                title,
                body,
                icon_url: '/logo.png'
            })
            .select()
            .single();

        if (error) {
            console.error('Error sending notification:', error);
            return { success: false, error: 'Failed to send notification' };
        }

        return {
            success: true,
            notification: data
        };
    } catch (error) {
        console.error('Error in sendCampaignNotification:', error);
        return { success: false, error: 'An unexpected error occurred' };
    }
}

/**
 * Mark notification as read
 */
export async function markNotificationRead(notificationId: string) {
    try {
        const supabase = await createClient();

        const { error } = await supabase
            .from('push_notifications')
            .update({
                read_at: new Date().toISOString(),
                status: 'read'
            })
            .eq('id', notificationId);

        if (error) {
            console.error('Error marking notification as read:', error);
            return { success: false, error: 'Failed to update notification' };
        }

        return { success: true };
    } catch (error) {
        console.error('Error in markNotificationRead:', error);
        return { success: false, error: 'An unexpected error occurred' };
    }
}

/**
 * Mark notification as clicked
 */
export async function markNotificationClicked(notificationId: string) {
    try {
        const supabase = await createClient();

        const { error } = await supabase
            .from('push_notifications')
            .update({
                clicked_at: new Date().toISOString(),
                status: 'clicked'
            })
            .eq('id', notificationId);

        if (error) {
            console.error('Error marking notification as clicked:', error);
            return { success: false, error: 'Failed to update notification' };
        }

        return { success: true };
    } catch (error) {
        console.error('Error in markNotificationClicked:', error);
        return { success: false, error: 'An unexpected error occurred' };
    }
}

/**
 * Get user's notifications
 */
export async function getUserNotifications(userId: string) {
    try {
        const supabase = await createClient();

        const { data: notifications, error } = await supabase
            .from('push_notifications')
            .select('*')
            .eq('user_id', userId)
            .order('sent_at', { ascending: false })
            .limit(50);

        if (error) {
            console.error('Error fetching notifications:', error);
            return { success: false, notifications: [], error: 'Failed to fetch notifications' };
        }

        return {
            success: true,
            notifications: notifications || []
        };
    } catch (error) {
        console.error('Error in getUserNotifications:', error);
        return { success: false, notifications: [], error: 'An unexpected error occurred' };
    }
}
