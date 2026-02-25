'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Points conversion formula: 1 SAR = 200 Points
 */
const SAR_TO_POINTS = 200;

export async function addPoints(userId: string, amountInSAR: number) {
    try {
        const supabase = await createClient();

        // Calculate points from SAR amount
        const pointsToAdd = Math.floor(amountInSAR * SAR_TO_POINTS);

        // Get current points
        const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('points')
            .eq('id', userId)
            .single();

        if (fetchError) {
            console.error('Error fetching profile:', fetchError);
            return { success: false, error: 'Failed to fetch profile' };
        }

        const currentPoints = profile?.points || 0;
        const newPoints = currentPoints + pointsToAdd;

        // Update points in database
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ points: newPoints })
            .eq('id', userId);

        if (updateError) {
            console.error('Error updating points:', updateError);
            return { success: false, error: 'Failed to update points' };
        }

        // Revalidate the path to update the UI
        revalidatePath('/[locale]');

        return {
            success: true,
            pointsAdded: pointsToAdd,
            newBalance: newPoints
        };
    } catch (error) {
        console.error('Error in addPoints:', error);
        return { success: false, error: 'An unexpected error occurred' };
    }
}

export async function getPoints(userId: string) {
    try {
        const supabase = await createClient();

        const { data: profile, error } = await supabase
            .from('profiles')
            .select('points')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching points:', error);
            return { success: false, error: 'Failed to fetch points', points: 0 };
        }

        return {
            success: true,
            points: profile?.points || 0
        };
    } catch (error) {
        console.error('Error in getPoints:', error);
        return { success: false, error: 'An unexpected error occurred', points: 0 };
    }
}

export async function deductPoints(userId: string, pointsToDeduct: number) {
    try {
        const supabase = await createClient();

        // Get current points
        const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('points')
            .eq('id', userId)
            .single();

        if (fetchError) {
            console.error('Error fetching profile:', fetchError);
            return { success: false, error: 'Failed to fetch profile' };
        }

        const currentPoints = profile?.points || 0;

        // Check if user has enough points
        if (currentPoints < pointsToDeduct) {
            return { success: false, error: 'Insufficient points' };
        }

        const newPoints = currentPoints - pointsToDeduct;

        // Update points in database
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ points: newPoints })
            .eq('id', userId);

        if (updateError) {
            console.error('Error updating points:', updateError);
            return { success: false, error: 'Failed to update points' };
        }

        // Revalidate the path to update the UI
        revalidatePath('/[locale]');

        return {
            success: true,
            pointsDeducted: pointsToDeduct,
            newBalance: newPoints
        };
    } catch (error) {
        console.error('Error in deductPoints:', error);
        return { success: false, error: 'An unexpected error occurred' };
    }
}
