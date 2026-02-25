// Reward Calculation Library
// Core business logic for ad-revenue share model

export interface EngagementMetrics {
    watchDuration: number;      // Seconds user watched
    requiredDuration: number;   // Minimum required seconds (e.g., 30)
    interactions: number;       // User interactions (clicks, pauses, etc.)
}

export interface CampaignBudget {
    campaignBudget: number;     // Total budget in SAR
    safyCosts: number;          // Platform costs in SAR
}

/**
 * Calculate net profit from campaign
 * Net Profit = Campaign Budget - SAFY Costs
 */
export function calculateNetProfit(budget: CampaignBudget): number {
    return budget.campaignBudget - budget.safyCosts;
}

/**
 * Calculate reward pool (70% of net profit distributed to users)
 * Reward Pool = Net Profit × 0.70
 */
export function calculateRewardPool(budget: CampaignBudget): number {
    const netProfit = calculateNetProfit(budget);
    return netProfit * 0.70;
}

/**
 * Calculate engagement score (0-100) based on user interaction
 * 
 * Scoring breakdown:
 * - Watch duration: up to 70 points (based on % of required duration watched)
 * - Interactions: up to 30 points (10 points per interaction, max 3)
 * 
 * @param metrics - User engagement metrics
 * @returns Engagement score between 0 and 100
 */
export function calculateEngagementScore(metrics: EngagementMetrics): number {
    // Duration score: 70 points max
    // If user watches full duration or more, they get 70 points
    const durationPercentage = metrics.watchDuration / metrics.requiredDuration;
    const durationScore = Math.min(durationPercentage * 70, 70);

    // Interaction score: 30 points max (10 points per interaction, max 3)
    const interactionScore = Math.min(metrics.interactions * 10, 30);

    const totalScore = durationScore + interactionScore;

    return Math.round(totalScore);
}

/**
 * Calculate user's SAR reward from the reward pool
 * 
 * Formula: (User Engagement Score / Total Engagement Points) × Reward Pool
 * 
 * @param rewardPool - Total SAR available for distribution (70% of net profit)
 * @param userEngagementScore - This user's engagement score (0-100)
 * @param totalEngagementPoints - Sum of all users' engagement scores
 * @returns User's SAR share, rounded to 2 decimal places
 */
export function calculateUserReward(
    rewardPool: number,
    userEngagementScore: number,
    totalEngagementPoints: number
): number {
    if (totalEngagementPoints === 0) {
        return 0;
    }

    // User's share = (userScore / totalScore) × rewardPool
    const userShare = (userEngagementScore / totalEngagementPoints) * rewardPool;

    // Round to 2 decimal places
    return Math.round(userShare * 100) / 100;
}

/**
 * Convert SAR to Points
 * Formula: 1 SAR = 200 Points
 * 
 * @param sar - Amount in SAR
 * @returns Points (integer)
 */
export function convertSARToPoints(sar: number): number {
    return Math.floor(sar * 200);
}

/**
 * Convert Points to SAR
 * Formula: 200 Points = 1 SAR
 * 
 * @param points - Amount in points
 * @returns SAR amount, rounded to 2 decimal places
 */
export function convertPointsToSAR(points: number): number {
    const sar = points / 200;
    return Math.round(sar * 100) / 100;
}

/**
 * Complete reward calculation for a user
 * Returns both SAR earned and points earned
 */
export function calculateCompleteReward(
    budget: CampaignBudget,
    userEngagementScore: number,
    totalEngagementPoints: number
): {
    netProfit: number;
    rewardPool: number;
    sarEarned: number;
    pointsEarned: number;
} {
    const netProfit = calculateNetProfit(budget);
    const rewardPool = calculateRewardPool(budget);
    const sarEarned = calculateUserReward(rewardPool, userEngagementScore, totalEngagementPoints);
    const pointsEarned = convertSARToPoints(sarEarned);

    return {
        netProfit,
        rewardPool,
        sarEarned,
        pointsEarned
    };
}

/**
 * Format SAR amount for display
 */
export function formatSAR(amount: number): string {
    return `₪${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Format points for display
 */
export function formatPoints(points: number): string {
    return points.toLocaleString('en-US');
}

// Example usage and test cases
export const EXAMPLES = {
    // Example 1: Single user gets entire reward pool
    singleUser: {
        budget: { campaignBudget: 1000, safyCosts: 200 },
        userScore: 85,
        totalScore: 85,
        expected: {
            netProfit: 800,
            rewardPool: 560,
            sarEarned: 560,
            pointsEarned: 112000
        }
    },

    // Example 2: Multiple users sharing reward pool
    multipleUsers: {
        budget: { campaignBudget: 1000, safyCosts: 200 },
        users: [
            { score: 85, expectedSAR: 63.47, expectedPoints: 12694 },
            { score: 70, expectedSAR: 52.27, expectedPoints: 10454 },
            { score: 50, expectedSAR: 37.33, expectedPoints: 7466 }
        ],
        totalScore: 205,
        rewardPool: 560
    },

    // Example 3: High engagement user
    highEngagement: {
        metrics: {
            watchDuration: 35,      // Watched 35 seconds
            requiredDuration: 30,   // Required 30 seconds
            interactions: 3         // 3 interactions
        },
        expectedScore: 100  // 70 (full duration) + 30 (3 interactions)
    },

    // Example 4: Low engagement user
    lowEngagement: {
        metrics: {
            watchDuration: 15,      // Watched only 15 seconds
            requiredDuration: 30,   // Required 30 seconds
            interactions: 0         // No interactions
        },
        expectedScore: 35  // 35 (50% duration) + 0 (no interactions)
    }
};
