// Mock Deals Data Generator
// Simulates real-time deals from multiple sources

export type DealSource = 'clickflyer' | 'pricena' | 'jarir' | 'noon' | 'amazon';

export interface Deal {
    id: string;
    title: string;
    titleAr: string;
    image: string;
    originalPrice: number;
    discountedPrice: number;
    discount: number;          // Percentage
    source: DealSource;
    category: string;          // Maps to taxonomy IDs
    rewardPoints: number;      // Calculated from discount amount
    url: string;
    featured?: boolean;
}

// Reward calculation: 1 SAR discount = 200 Points
const calculateRewardPoints = (originalPrice: number, discountedPrice: number): number => {
    const discountAmount = originalPrice - discountedPrice;
    return Math.floor(discountAmount * 200);
};

// Mock product images (using placeholder service)
const getProductImage = (category: string, index: number): string => {
    const seed = `${category}-${index}`;
    return `https://picsum.photos/seed/${seed}/400/400`;
};

// Generate mock deals
export const MOCK_DEALS: Deal[] = [
    // Electronics - Smartphones
    {
        id: 'deal-001',
        title: 'Samsung Galaxy S24 Ultra 256GB',
        titleAr: 'سامسونج جالاكسي S24 الترا 256 جيجا',
        image: getProductImage('smartphone', 1),
        originalPrice: 4299,
        discountedPrice: 3599,
        discount: 16,
        source: 'noon',
        category: 'electronics/mobiles/smartphones',
        rewardPoints: 0,
        url: '#',
        featured: true
    },
    {
        id: 'deal-002',
        title: 'iPhone 15 Pro Max 512GB',
        titleAr: 'آيفون 15 برو ماكس 512 جيجا',
        image: getProductImage('smartphone', 2),
        originalPrice: 6499,
        discountedPrice: 5899,
        discount: 9,
        source: 'amazon',
        category: 'electronics/mobiles/smartphones',
        rewardPoints: 0,
        url: '#',
        featured: true
    },
    {
        id: 'deal-003',
        title: 'Xiaomi 14 Pro 5G 256GB',
        titleAr: 'شاومي 14 برو 5G 256 جيجا',
        image: getProductImage('smartphone', 3),
        originalPrice: 2799,
        discountedPrice: 2199,
        discount: 21,
        source: 'jarir',
        category: 'electronics/mobiles/smartphones',
        rewardPoints: 0,
        url: '#'
    },

    // Electronics - Laptops
    {
        id: 'deal-004',
        title: 'MacBook Pro 14" M3 Pro 18GB RAM',
        titleAr: 'ماك بوك برو 14 بوصة M3 برو 18 جيجا رام',
        image: getProductImage('laptop', 1),
        originalPrice: 9999,
        discountedPrice: 8799,
        discount: 12,
        source: 'noon',
        category: 'electronics/computers/laptops',
        rewardPoints: 0,
        url: '#',
        featured: true
    },
    {
        id: 'deal-005',
        title: 'Dell XPS 15 Intel i9 32GB RAM',
        titleAr: 'ديل XPS 15 إنتل i9 32 جيجا رام',
        image: getProductImage('laptop', 2),
        originalPrice: 7499,
        discountedPrice: 6299,
        discount: 16,
        source: 'amazon',
        category: 'electronics/computers/laptops',
        rewardPoints: 0,
        url: '#'
    },

    // Electronics - Headphones
    {
        id: 'deal-006',
        title: 'Sony WH-1000XM5 Noise Cancelling',
        titleAr: 'سوني WH-1000XM5 عزل للضوضاء',
        image: getProductImage('headphones', 1),
        originalPrice: 1499,
        discountedPrice: 1099,
        discount: 27,
        source: 'jarir',
        category: 'electronics/audio/headphones',
        rewardPoints: 0,
        url: '#'
    },
    {
        id: 'deal-007',
        title: 'AirPods Pro 2nd Generation',
        titleAr: 'إيربودز برو الجيل الثاني',
        image: getProductImage('headphones', 2),
        originalPrice: 999,
        discountedPrice: 849,
        discount: 15,
        source: 'noon',
        category: 'electronics/audio/earbuds',
        rewardPoints: 0,
        url: '#'
    },

    // Home Appliances - Coffee Makers
    {
        id: 'deal-008',
        title: 'Nespresso Vertuo Next Coffee Machine',
        titleAr: 'نسبريسو فيرتو نكست آلة قهوة',
        image: getProductImage('coffee', 1),
        originalPrice: 899,
        discountedPrice: 649,
        discount: 28,
        source: 'jarir',
        category: 'home-appliances/kitchen/coffee',
        rewardPoints: 0,
        url: '#',
        featured: true
    },
    {
        id: 'deal-009',
        title: 'De&apos;Longhi Magnifica S Espresso',
        titleAr: 'ديلونجي ماجنيفيكا S إسبريسو',
        image: getProductImage('coffee', 2),
        originalPrice: 2499,
        discountedPrice: 1999,
        discount: 20,
        source: 'amazon',
        category: 'home-appliances/kitchen/coffee',
        rewardPoints: 0,
        url: '#'
    },

    // Home Appliances - Blenders
    {
        id: 'deal-010',
        title: 'Vitamix E310 Explorian Blender',
        titleAr: 'فيتاميكس E310 إكسبلوريان خلاط',
        image: getProductImage('blender', 1),
        originalPrice: 1799,
        discountedPrice: 1399,
        discount: 22,
        source: 'noon',
        category: 'home-appliances/kitchen/blenders',
        rewardPoints: 0,
        url: '#'
    },

    // Home Appliances - Vacuums
    {
        id: 'deal-011',
        title: 'Dyson V15 Detect Absolute',
        titleAr: 'دايسون V15 ديتكت أبسولوت',
        image: getProductImage('vacuum', 1),
        originalPrice: 3299,
        discountedPrice: 2799,
        discount: 15,
        source: 'jarir',
        category: 'home-appliances/cleaning/vacuums',
        rewardPoints: 0,
        url: '#',
        featured: true
    },

    // Grocery - Snacks
    {
        id: 'deal-012',
        title: 'Lay&apos;s Chips Family Pack 12x25g',
        titleAr: 'ليز شيبس عائلي 12×25 جرام',
        image: getProductImage('snacks', 1),
        originalPrice: 45,
        discountedPrice: 29,
        discount: 36,
        source: 'clickflyer',
        category: 'grocery/food/snacks',
        rewardPoints: 0,
        url: '#'
    },
    {
        id: 'deal-013',
        title: 'Pringles Original 6-Pack',
        titleAr: 'برينجلز أوريجينال 6 علب',
        image: getProductImage('snacks', 2),
        originalPrice: 38,
        discountedPrice: 25,
        discount: 34,
        source: 'pricena',
        category: 'grocery/food/snacks',
        rewardPoints: 0,
        url: '#'
    },

    // Grocery - Beverages
    {
        id: 'deal-014',
        title: 'Coca-Cola Zero 24-Pack Cans',
        titleAr: 'كوكاكولا زيرو 24 علبة',
        image: getProductImage('beverages', 1),
        originalPrice: 52,
        discountedPrice: 39,
        discount: 25,
        source: 'clickflyer',
        category: 'grocery/food/beverages',
        rewardPoints: 0,
        url: '#'
    },

    // Fashion - Men's Clothing
    {
        id: 'deal-015',
        title: 'Nike Dri-FIT Training T-Shirt',
        titleAr: 'نايكي دراي-فيت تيشيرت تدريب',
        image: getProductImage('clothing', 1),
        originalPrice: 149,
        discountedPrice: 99,
        discount: 34,
        source: 'noon',
        category: 'fashion/clothing/men',
        rewardPoints: 0,
        url: '#'
    },
    {
        id: 'deal-016',
        title: 'Adidas Essentials Hoodie',
        titleAr: 'أديداس إيسينشالز هودي',
        image: getProductImage('clothing', 2),
        originalPrice: 299,
        discountedPrice: 199,
        discount: 33,
        source: 'amazon',
        category: 'fashion/clothing/men',
        rewardPoints: 0,
        url: '#'
    },

    // Fashion - Sneakers
    {
        id: 'deal-017',
        title: 'Nike Air Max 270 React',
        titleAr: 'نايكي إير ماكس 270 رياكت',
        image: getProductImage('sneakers', 1),
        originalPrice: 699,
        discountedPrice: 499,
        discount: 29,
        source: 'noon',
        category: 'fashion/shoes/sneakers',
        rewardPoints: 0,
        url: '#',
        featured: true
    },

    // Entertainment - Gaming
    {
        id: 'deal-018',
        title: 'PlayStation 5 Slim Digital Edition',
        titleAr: 'بلايستيشن 5 سليم نسخة رقمية',
        image: getProductImage('gaming', 1),
        originalPrice: 2099,
        discountedPrice: 1899,
        discount: 10,
        source: 'jarir',
        category: 'entertainment/gaming/consoles',
        rewardPoints: 0,
        url: '#',
        featured: true
    },
    {
        id: 'deal-019',
        title: 'Xbox Series X 1TB',
        titleAr: 'إكس بوكس سيريز X 1 تيرابايت',
        image: getProductImage('gaming', 2),
        originalPrice: 2299,
        discountedPrice: 1999,
        discount: 13,
        source: 'amazon',
        category: 'entertainment/gaming/consoles',
        rewardPoints: 0,
        url: '#'
    },

    // Sports - Fitness
    {
        id: 'deal-020',
        title: 'Adjustable Dumbbell Set 20kg',
        titleAr: 'طقم دمبل قابل للتعديل 20 كجم',
        image: getProductImage('fitness', 1),
        originalPrice: 599,
        discountedPrice: 449,
        discount: 25,
        source: 'noon',
        category: 'sports/fitness/weights',
        rewardPoints: 0,
        url: '#'
    }
];

// Calculate reward points for all deals
MOCK_DEALS.forEach(deal => {
    deal.rewardPoints = calculateRewardPoints(deal.originalPrice, deal.discountedPrice);
});

// Helper function to get deals by category
export const getDealsByCategory = (categoryId: string): Deal[] => {
    return MOCK_DEALS.filter(deal => {
        // Exact match or parent match
        return deal.category === categoryId || deal.category.startsWith(categoryId + '/');
    });
};

// Helper function to get deals by multiple interests
export const getDealsByInterests = (interests: string[]): Deal[] => {
    if (!interests || interests.length === 0) {
        return [];
    }

    const matchingDeals = MOCK_DEALS.filter(deal => {
        return interests.some(interest => {
            // Exact match or parent match
            return deal.category === interest || deal.category.startsWith(interest + '/');
        });
    });

    // Sort by reward points (highest first)
    return matchingDeals.sort((a, b) => b.rewardPoints - a.rewardPoints);
};

// Helper function to get featured deals
export const getFeaturedDeals = (): Deal[] => {
    return MOCK_DEALS.filter(deal => deal.featured);
};

// Helper function to format price
export const formatPrice = (price: number): string => {
    return `₪${price.toLocaleString()}`;
};

// Helper function to format points
export const formatPoints = (points: number): string => {
    return points.toLocaleString();
};
