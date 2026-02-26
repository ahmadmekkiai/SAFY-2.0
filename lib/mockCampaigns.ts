// Mock Ad Campaigns — Updated for SAFY 2.0 (Server & Client Compatible)

export type DealSource = 'jarir' | 'amazon' | 'noon' | 'extra' | 'panda' | 'clickflyer' | 'pricena';

export interface AdCampaign {
    id: string;
    title: string;
    titleAr?: string;
    description?: string;
    image?: string; 
    video_url?: string; 
    productUrl: string;
    category: string;
    source: DealSource;
    verified: boolean;

    // Pricing
    originalPrice: number;
    discountedPrice: number;
    currency: 'SAR';
    discountPercentage?: number;

    // Economics (المفتش محتاج دول عشان الحسابات)
    cpcRate: number;
    cpcCost: number;
    cpc_value: number; 
    campaignBudget: number; // رجعنا دي
    safyCosts: number;      // ورجعنا دي

    // Merchant Data
    merchant: {
        name: string;
        category: string;
        logo: string;
    };

    // Tracking (الحقول اللي سببت الخطأ الأخير)
    totalViews: number;
    totalClicks: number;
    totalCompletions: number;
    totalEngagementPoints: number;

    status: 'active' | 'paused' | 'completed';
    featured: boolean;
    priority: number;
    expiresAt: Date;
    distance?: number;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

export const getDiscountPercentage = (original: number, discounted: number): number =>
    Math.round(((original - discounted) / original) * 100);

export const calculateRewardPool = (budget: number, costs: number): number =>
    (budget - costs) * 0.70;

export const formatSAR = (amount: number): string =>
    `${amount.toLocaleString('en-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SAR`;

// ─── Real Campaign Data ──────────────────────────────────────────────────────

export const MOCK_CAMPAIGNS: AdCampaign[] = [
    {
        id: 'campaign-001',
        title: 'iPhone 15 Pro Max 256GB',
        titleAr: 'آيفون 15 برو ماكس 256 جيجا',
        description: 'Apple A17 Pro chip, 48MP camera system.',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
        video_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
        productUrl: 'https://www.jarir.com/sa-en/apple-iphone-15-pro-max-smartphones-624346.html',
        category: 'electronics/mobiles/smartphones',
        source: 'jarir',
        verified: true,
        originalPrice: 5199,
        discountedPrice: 4699,
        currency: 'SAR',
        discountPercentage: 10,
        cpcRate: 2.00,
        cpcCost: 0.40,
        cpc_value: 20,
        campaignBudget: 1000,
        safyCosts: 200,
        totalViews: 0,
        totalClicks: 0,
        totalCompletions: 0,
        totalEngagementPoints: 0,
        merchant: {
            name: "مكتبة جرير",
            category: "إلكترونيات",
            logo: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800"
        },
        status: 'active', featured: true, priority: 10,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
];

export const getCampaignsByInterests = (interests: string[]): AdCampaign[] => {
    if (!interests || interests.length === 0) return MOCK_CAMPAIGNS;
    return MOCK_CAMPAIGNS.filter(c => interests.some(i => c.category.includes(i)));
};

export const getCampaignById = (id: string): AdCampaign | undefined =>
    MOCK_CAMPAIGNS.find(c => c.id === id);