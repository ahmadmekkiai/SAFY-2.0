export interface Place {
    id: string;
    name: string;
    category: string;
    lat: number;
    lng: number;
    logo: string;
    cover_image: string;
    rating: number;
    phone?: string;
    order_links?: string[]; // Assuming order links are strings/URLs. The type could be refined if needed.
}

export interface Campaign {
    id: string;
    place_id: string;
    cpc_value: number;
    discount_percentage: number;
    campaign_budget: number;
    status: string; // e.g., 'active', 'paused', 'completed'
}

export interface UnifiedFeedItem {
    place: Place;
    campaign?: Campaign;
}
