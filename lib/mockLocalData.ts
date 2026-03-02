import { UnifiedFeedItem } from "@/types/app";

export const FALLBACK_LOCATION = { lat: 24.7136, lng: 46.6753 };

const RiyadhCenter = { lat: 24.7136, lng: 46.6753 };
const offset = (max: number) => (Math.random() - 0.5) * max;

function generateMockData(): UnifiedFeedItem[] {
    const categories = ["أكل منزلي / أسر منتجة", "شاورما", "برجر", "فول وفلافل", "بخاري", "قهوة", "حلى", "مشويات", "بيتزا"];
    const names = ["بيت الشاورما", "ماكدونالدز", "الرومانسية", "دوز كافيه", "هامبرغيني", "شاورمر", "فوال الطايف", "البيك", "دانكن", "توم توم", "عصير تايم", "قطوف وحلا", "كودو", "هرفي"];

    const items: UnifiedFeedItem[] = [];

    // Create 45 items total
    for (let i = 1; i <= 45; i++) {
        // Pick name and category
        const isBranch = i % 3 === 0;
        const nameIndex = isBranch ? (i % names.length) : Math.floor(Math.random() * names.length);
        const baseName = names[nameIndex];
        const category = categories[Math.floor(Math.random() * categories.length)];

        // Simulate multiple branches by adding location suffix sometimes
        const branchName = isBranch ? `${baseName} - فرع ${Math.floor(Math.random() * 10) + 1}` : baseName;

        // Ad vs Normal: ~60% ads
        const isAd = Math.random() > 0.4;

        const lat = RiyadhCenter.lat + offset(0.1);
        const lng = RiyadhCenter.lng + offset(0.1);

        const images = [
            "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&q=80",
            "https://images.unsplash.com/photo-1529144415895-6aaf8be872fb?w=500&q=80",
            "https://images.unsplash.com/photo-1626200926733-611385494d49?w=500&q=80",
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
            "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&q=80",
            "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80",
            "https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?w=500&q=80"
        ];

        const placeId = `place_${i}`;

        items.push({
            place: {
                id: placeId,
                name: branchName,
                category: category,
                lat: lat,
                lng: lng,
                logo: images[Math.floor(Math.random() * images.length)],
                cover_image: images[Math.floor(Math.random() * images.length)],
                rating: Number((Math.random() * 2 + 3).toFixed(1)), // 3.0 to 5.0
                phone: Math.random() > 0.3 ? `+9665${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}` : undefined,
                order_links: Math.random() > 0.5 ? ["https://jahez.app", "https://hungerstation.com"] : []
            },
            campaign: isAd ? {
                id: `camp_${i}`,
                place_id: placeId,
                cpc_value: Math.floor(Math.random() * 20) + 10,
                discount_percentage: Math.floor(Math.random() * 40) + 10,
                campaign_budget: 5000,
                status: "active" as const
            } : undefined
        });
    }

    return items;
}

export const mockUnifiedFeed = generateMockData();
