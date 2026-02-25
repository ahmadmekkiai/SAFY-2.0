export interface Merchant {
    id: string;
    name: string;
    logo: string;
    category: string;
    overall_likes: number;
    overall_dislikes: number;
}

export interface Campaign {
    id: string;
    merchant_id: string;
    title: string;
    video_url: string; // or image
    lat: number;
    lng: number;
    discountPercentage: number; // For filtering
    cpc_value: number; // total budget per view
    bounty_budget: number; // The pre-paid budget allocated for receipt cashbacks
    bounty_reward: number; // The fixed points given per valid receipt
    phone_number?: string; // For local dine-in calls
    order_url?: string; // For online orders
    actionText?: string; // Dynamic action text for the primary button
    is_active: boolean;
}

export interface Interaction {
    user_id: string;
    campaign_id: string;
    liked: boolean;
    receipt_image_url?: string;
    receipt_status: 'pending' | 'approved' | 'rejected' | null;
}
