// Mock Ad Campaigns — Real Saudi Market Prices & Product URLs (Feb 2026)

export type DealSource = 'jarir' | 'amazon' | 'noon' | 'extra' | 'panda' | 'clickflyer' | 'pricena';

export interface AdCampaign {
    id: string;
    title: string;
    titleAr: string;
    description: string;
    image: string;

    /** Deep link to the specific product page */
    productUrl: string;

    category: string;
    source: DealSource;
    verified: true;

    // Pricing
    originalPrice: number;
    discountedPrice: number;
    currency: 'SAR';

    /**
     * CPC economics (Cost-Per-Click model)
     * cpcRate     — what the advertiser pays SAFY per click (SAR)
     * cpcCost     — SAFY's operational cost per click (SAR)
     * userEarning — (cpcRate - cpcCost) * 0.70  → user's share per click
     */
    cpcRate: number;
    cpcCost: number;

    // Legacy budget fields (kept for reward pool display)
    campaignBudget: number;
    safyCosts: number;

    // Engagement tracking
    totalViews: number;
    totalClicks: number;
    totalCompletions: number;
    totalEngagementPoints: number;

    status: 'active' | 'paused' | 'completed';
    featured: boolean;
    priority: number;
    expiresAt: Date;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

export const getDiscountPercentage = (original: number, discounted: number): number =>
    Math.round(((original - discounted) / original) * 100);

/** User earns (cpcRate - cpcCost) * 70% per click */
export const calcUserEarningPerClick = (cpcRate: number, cpcCost: number): number =>
    parseFloat(((cpcRate - cpcCost) * 0.70).toFixed(2));

export const calculateNetProfit = (budget: number, costs: number): number =>
    budget - costs;

export const calculateRewardPool = (budget: number, costs: number): number =>
    calculateNetProfit(budget, costs) * 0.70;

export const estimateUserPoints = (budget: number, costs: number, estimatedUsers = 100): number =>
    Math.floor((calculateRewardPool(budget, costs) / estimatedUsers) * 200);

export const formatSAR = (amount: number): string =>
    `${amount.toLocaleString('en-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SAR`;

export const formatPoints = (points: number): string =>
    points.toLocaleString('en-US');

// ─── Real Campaign Data ──────────────────────────────────────────────────────

export const MOCK_CAMPAIGNS: AdCampaign[] = [
    // ─── EXISTING 8 DEALS (High Value - Verified Deep Links) ───
    {
        id: 'campaign-001',
        title: 'iPhone 15 Pro Max 256GB — Natural Titanium',
        titleAr: 'آيفون 15 برو ماكس 256 جيجا — تيتانيوم طبيعي',
        description: 'Apple A17 Pro chip, 48MP camera system, USB-C with USB 3 speeds.',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop',
        productUrl: 'https://www.jarir.com/sa-en/apple-iphone-15-pro-max-smartphones-624346.html',
        category: 'electronics/mobiles/smartphones',
        source: 'jarir',
        verified: true,
        originalPrice: 5199,
        discountedPrice: 4699,
        currency: 'SAR',
        cpcRate: 2.00,
        cpcCost: 0.40,
        campaignBudget: 1000,
        safyCosts: 200,
        totalViews: 0, totalClicks: 0, totalCompletions: 0, totalEngagementPoints: 0,
        status: 'active', featured: true, priority: 10,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    {
        id: 'campaign-002',
        title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
        titleAr: 'سوني WH-1000XM5 سماعات لاسلكية بإلغاء الضوضاء',
        description: 'Industry-leading noise cancellation, 30-hour battery, multipoint connection.',
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=800&fit=crop',
        productUrl: 'https://www.amazon.sa/dp/B09XS7JWHH',
        category: 'electronics/audio/headphones',
        source: 'amazon',
        verified: true,
        originalPrice: 1299,
        discountedPrice: 999,
        currency: 'SAR',
        cpcRate: 1.50,
        cpcCost: 0.30,
        campaignBudget: 300,
        safyCosts: 60,
        totalViews: 0, totalClicks: 0, totalCompletions: 0, totalEngagementPoints: 0,
        status: 'active', featured: true, priority: 9,
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    },
    {
        id: 'campaign-003',
        title: 'Samsung Galaxy S24 Ultra 512GB — Titanium Black',
        titleAr: 'سامسونج جالاكسي S24 الترا 512 جيجا — تيتانيوم أسود',
        description: 'Built-in S Pen, 200MP camera, Galaxy AI features, titanium frame.',
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=800&fit=crop',
        productUrl: 'https://www.noon.com/saudi-en/samsung-galaxy-s24-ultra-5g-dual-sim-512gb-12gb-ram-titanium-black/N70040218V/p',
        category: 'electronics/mobiles/smartphones',
        source: 'noon',
        verified: true,
        originalPrice: 4999,
        discountedPrice: 3999,
        currency: 'SAR',
        cpcRate: 1.80,
        cpcCost: 0.36,
        campaignBudget: 800,
        safyCosts: 160,
        totalViews: 0, totalClicks: 0, totalCompletions: 0, totalEngagementPoints: 0,
        status: 'active', featured: true, priority: 8,
        expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)
    },
    {
        id: 'campaign-004',
        title: 'MacBook Pro 14" M3 Pro — Space Black',
        titleAr: 'ماك بوك برو 14 بوصة M3 برو — أسود فضائي',
        description: 'M3 Pro chip, 18GB RAM, 512GB SSD, Liquid Retina XDR display.',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop',
        productUrl: 'https://www.extra.com/en-sa/apple/apple-macbook-pro-14-m3-pro-chip-with-11-core-cpu-and-14-core-gpu-18gb-memory-512gb/p/100430498',
        category: 'electronics/computers/laptops',
        source: 'extra',
        verified: true,
        originalPrice: 7999,
        discountedPrice: 6999,
        currency: 'SAR',
        cpcRate: 2.50,
        cpcCost: 0.50,
        campaignBudget: 1200,
        safyCosts: 240,
        totalViews: 0, totalClicks: 0, totalCompletions: 0, totalEngagementPoints: 0,
        status: 'active', featured: true, priority: 7,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    {
        id: 'campaign-005',
        title: 'Dyson V15 Detect Absolute Vacuum Cleaner',
        titleAr: 'دايسون V15 ديتكت أبسولوت مكنسة كهربائية',
        description: 'Laser dust detection, HEPA filtration, 60-min runtime, LCD screen.',
        image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&h=800&fit=crop',
        productUrl: 'https://www.amazon.sa/dp/B09MFMTQXJ',
        category: 'home-appliances/cleaning/vacuums',
        source: 'amazon',
        verified: true,
        originalPrice: 2299,
        discountedPrice: 1799,
        currency: 'SAR',
        cpcRate: 1.20,
        cpcCost: 0.24,
        campaignBudget: 500,
        safyCosts: 100,
        totalViews: 0, totalClicks: 0, totalCompletions: 0, totalEngagementPoints: 0,
        status: 'active', featured: false, priority: 6,
        expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
    },
    {
        id: 'campaign-006',
        title: 'PlayStation 5 Slim — Disc Edition',
        titleAr: 'بلايستيشن 5 سليم — نسخة الأقراص',
        description: 'Next-gen gaming, 1TB SSD, 4K Blu-ray, DualSense wireless controller.',
        image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&h=800&fit=crop',
        productUrl: 'https://www.jarir.com/sa-en/sony-playstation-5-slim-disc-edition-gaming-consoles-625001.html',
        category: 'entertainment/gaming/consoles',
        source: 'jarir',
        verified: true,
        originalPrice: 2199,
        discountedPrice: 1899,
        currency: 'SAR',
        cpcRate: 1.60,
        cpcCost: 0.32,
        campaignBudget: 600,
        safyCosts: 120,
        totalViews: 0, totalClicks: 0, totalCompletions: 0, totalEngagementPoints: 0,
        status: 'active', featured: false, priority: 5,
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    },
    {
        id: 'campaign-007',
        title: 'Nike Air Max 270 React — Men\'s Running Shoes',
        titleAr: 'نايكي إير ماكس 270 رياكت — رجالي',
        description: 'Max Air unit, React foam, breathable mesh upper, all-day comfort.',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
        productUrl: 'https://www.noon.com/saudi-en/nike-air-max-270-react-mens-shoes/N35543279A/p',
        category: 'fashion/shoes/sneakers',
        source: 'noon',
        verified: true,
        originalPrice: 649,
        discountedPrice: 449,
        currency: 'SAR',
        cpcRate: 0.80,
        cpcCost: 0.16,
        campaignBudget: 200,
        safyCosts: 40,
        totalViews: 0, totalClicks: 0, totalCompletions: 0, totalEngagementPoints: 0,
        status: 'active', featured: false, priority: 4,
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    },
    {
        id: 'campaign-008',
        title: 'Nespresso Vertuo Next Coffee Machine — Black',
        titleAr: 'نسبريسو فيرتو نكست آلة قهوة — أسود',
        description: 'Centrifusion technology, 5 cup sizes, Bluetooth connectivity, 30s heat-up.',
        image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&h=800&fit=crop',
        productUrl: 'https://www.extra.com/en-sa/nespresso/nespresso-vertuo-next-coffee-machine/p/100398765',
        category: 'home-appliances/kitchen/coffee',
        source: 'extra',
        verified: true,
        originalPrice: 799,
        discountedPrice: 599,
        currency: 'SAR',
        cpcRate: 1.00,
        cpcCost: 0.20,
        campaignBudget: 250,
        safyCosts: 50,
        totalViews: 0, totalClicks: 0, totalCompletions: 0, totalEngagementPoints: 0,
        status: 'active', featured: false, priority: 3,
        expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
    },

    // ─── CLICKFLYER DEALS (Groceries & Household - High Discount) ───
    {
        id: 'cf-001',
        title: 'Ariel Powder Detergent 5kg',
        titleAr: 'مسحوق غسيل اريال 5 كيلو',
        description: 'Original scent, removes tough stains in one wash.',
        image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&fit=crop',
        productUrl: 'https://clickflyer.com/sa-en/offers?q=ariel',
        category: 'household/cleaning/detergents',
        source: 'clickflyer', verified: true,
        originalPrice: 89, discountedPrice: 45, currency: 'SAR',
        cpcRate: 0.50, cpcCost: 0.10, campaignBudget: 100, safyCosts: 20,
        totalViews: 0, totalClicks: 0, totalCompletions: 0, totalEngagementPoints: 0, status: 'active', featured: false, priority: 5, expiresAt: new Date()
    },
    {
        id: 'cf-002',
        title: 'Almarai Full Fat Milk 1L x 12 Pack',
        titleAr: 'حليب المراعي كامل الدسم 1 لتر - كرتون 12 حبة',
        description: 'Fresh and nutritious, vitamin D enriched.',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&fit=crop',
        productUrl: 'https://clickflyer.com/sa-en/offers?q=almarai',
        category: 'groceries/dairy/milk',
        source: 'clickflyer', verified: true,
        originalPrice: 62, discountedPrice: 39, currency: 'SAR',
        cpcRate: 0.40, cpcCost: 0.08, campaignBudget: 100, safyCosts: 20,
        totalViews: 0, totalClicks: 0, totalCompletions: 0, totalEngagementPoints: 0, status: 'active', featured: false, priority: 5, expiresAt: new Date()
    },
    {
        id: 'cf-003',
        title: 'Pampers Baby Dry Diapers Size 5 - Giant Pack',
        titleAr: 'حفاضات بامبرز بيبي دراي مقاس 5 - عبوة عملاقة',
        description: 'Up to 12 hours of dryness, with stretchable sides.',
        image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&fit=crop',
        productUrl: 'https://clickflyer.com/sa-en/offers?q=pampers',
        category: 'baby/diapers',
        source: 'clickflyer', verified: true,
        originalPrice: 135, discountedPrice: 85, currency: 'SAR',
        cpcRate: 0.60, cpcCost: 0.12, campaignBudget: 100, safyCosts: 20,
        totalViews: 0, totalClicks: 0, totalCompletions: 0, totalEngagementPoints: 0, status: 'active', featured: false, priority: 5, expiresAt: new Date()
    },
    {
        id: 'cf-004',
        title: 'Nutella Hazelnut Spread 750g',
        titleAr: 'نوتيلا شوكولاتة بالبندق 750 جرام',
        description: 'The original hazelnut spread with cocoa.',
        image: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?w=800&fit=crop',
        productUrl: 'https://clickflyer.com/sa-en/offers?q=nutella',
        category: 'groceries/pantry/spreads',
        source: 'clickflyer', verified: true,
        originalPrice: 34, discountedPrice: 19, currency: 'SAR',
        cpcRate: 0.30, cpcCost: 0.06, campaignBudget: 100, safyCosts: 20,
        totalViews: 0, totalClicks: 0, totalCompletions: 0, totalEngagementPoints: 0, status: 'active', featured: false, priority: 4, expiresAt: new Date()
    },
    {
        id: 'cf-005',
        title: 'Tide Liquid Gel 2.5L',
        titleAr: 'تايد سائل غسيل 2.5 لتر',
        description: 'Brilliant cleaning, fresh scent.',
        image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&fit=crop',
        productUrl: 'https://clickflyer.com/sa-en/offers?q=tide',
        category: 'household/cleaning/detergents',
        source: 'clickflyer', verified: true,
        originalPrice: 45, discountedPrice: 22, currency: 'SAR',
        cpcRate: 0.45, cpcCost: 0.09, campaignBudget: 100, safyCosts: 20,
        totalViews: 0, totalClicks: 0, totalCompletions: 0, totalEngagementPoints: 0, status: 'active', featured: false, priority: 4, expiresAt: new Date()
    },
    {
        id: 'cf-006',
        title: 'Lipton Yellow Label Tea Bags 100s',
        titleAr: 'شاي ليبتون العلامة الصفراء 100 كيس',
        description: 'Rich taste, sun-ripened tea leaves.',
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&fit=crop',
        productUrl: 'https://clickflyer.com/sa-en/offers?q=lipton',
        category: 'groceries/beverages/tea',
        source: 'clickflyer', verified: true,
        originalPrice: 24, discountedPrice: 14, currency: 'SAR',
        cpcRate: 0.25, cpcCost: 0.05, campaignBudget: 100, safyCosts: 20,
        totalViews: 0, totalClicks: 0, totalCompletions: 0, totalEngagementPoints: 0, status: 'active', featured: false, priority: 3, expiresAt: new Date()
    },
    {
        id: 'cf-007',
        title: 'Galaxy Flutes Chocolate 22.5g x 24',
        titleAr: 'جالكسي فلوتس شوكولاتة - علبة 24',
        description: 'Crispy wafer rolls with chocolate cream.',
        image: 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=800&fit=crop',
        productUrl: 'https://clickflyer.com/sa-en/offers?q=galaxy',
        category: 'groceries/snacks/chocolate',
        source: 'clickflyer', verified: true,
        originalPrice: 42, discountedPrice: 20, currency: 'SAR',
        cpcRate: 0.35, cpcCost: 0.07, campaignBudget: 100, safyCosts: 20,
        totalViews: 0, totalClicks: 0, totalCompletions: 0, totalEngagementPoints: 0, status: 'active', featured: false, priority: 3, expiresAt: new Date()
    },
    {
        id: 'cf-008',
        title: 'Fine Facial Tissues 5 + 1 Free',
        titleAr: 'مناديل فاين للوجه 5 + 1 مجانا',
        description: 'Sterilized for germ protection.',
        image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&fit=crop',
        productUrl: 'https://clickflyer.com/sa-en/offers?q=fine',
        category: 'household/paper/tissues',
        source: 'clickflyer', verified: true,
        originalPrice: 28, discountedPrice: 18, currency: 'SAR',
        cpcRate: 0.30, cpcCost: 0.06, campaignBudget: 100, safyCosts: 20,
        totalViews: 0, totalClicks: 0, totalCompletions: 0, totalEngagementPoints: 0, status: 'active', featured: false, priority: 3, expiresAt: new Date()
    },
    {
        id: 'cf-009',
        title: 'Nivea Body Lotion Cocoa Butter 400ml',
        titleAr: 'نيفا لوشن للجسم بزبدة الكاكاو 400 مل',
        description: 'Deep moisture serum, 48h hydration.',
        image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?w=800&fit=crop',
        productUrl: 'https://clickflyer.com/sa-en/offers?q=nivea',
        category: 'beauty/skincare/body',
        source: 'clickflyer', verified: true,
        originalPrice: 32, discountedPrice: 15, currency: 'SAR',
        cpcRate: 0.40, cpcCost: 0.08, campaignBudget: 100, safyCosts: 20,
        totalViews: 0, totalClicks: 0, totalCompletions: 0, totalEngagementPoints: 0, status: 'active', featured: false, priority: 3, expiresAt: new Date()
    },
    {
        id: 'cf-010',
        title: 'Sunbulah Frozen Garden Peas 800g',
        titleAr: 'بازلاء خضراء السنبلة مجمدة 800 جرام',
        description: 'Freshly frozen garden peas.',
        image: 'https://images.unsplash.com/photo-1592394533824-9436d7d25407?w=800&fit=crop',
        productUrl: 'https://clickflyer.com/sa-en/offers?q=sunbulah',
        category: 'groceries/frozen/vegetables',
        source: 'clickflyer', verified: true,
        originalPrice: 18, discountedPrice: 9, currency: 'SAR',
        cpcRate: 0.20, cpcCost: 0.04, campaignBudget: 100, safyCosts: 20,
        totalViews: 0, totalClicks: 0, totalCompletions: 0, totalEngagementPoints: 0, status: 'active', featured: false, priority: 2, expiresAt: new Date()
    },

    // ─── PRICENA DEALS (Tech Comparisons - High Discount) ───
    {
        id: 'pr-001',
        title: 'iPad Air 5th Gen 64GB WiFi - Blue',
        titleAr: 'آيباد اير الجيل الخامس 64 جيجا واي فاي - أزرق',
        description: 'M1 chip, 10.9-inch Liquid Retina display.',
        image: 'https://images.unsplash.com/photo-1611532736697-b3542f853b90?w=800&fit=crop',
        productUrl: 'https://sa.pricena.com/en/product/apple-ipad-air-2022-price-in-saudi-arabia-50953934',
        category: 'electronics/tablets',
        source: 'pricena', verified: true,
        originalPrice: 2499, discountedPrice: 1999, currency: 'SAR',
        cpcRate: 1.00, cpcCost: 0.20, campaignBudget: 200, safyCosts: 40,
        totalViews: 0, totalClicks: 0, totalCompletions: 0, totalEngagementPoints: 0, status: 'active', featured: true, priority: 6, expiresAt: new Date()
    },
    {
        id: 'pr-002',
        title: 'Samsung 55" BU8000 Crystal UHD 4K TV',
        titleAr: 'تلفزيون سامسونج 55 بوصة كريستال فور كي',
        description: 'Dynamic Crystal Color, AirSlim design.',
        image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&fit=crop',
        productUrl: 'https://sa.pricena.com/en/search/?s=samsung+55+bu8000',
        category: 'electronics/tv/smart-tv',
        source: 'pricena', verified: true,
        originalPrice: 2799, discountedPrice: 1899, currency: 'SAR',
        cpcRate: 1.20, cpcCost: 0.24, campaignBudget: 300, safyCosts: 60,
        totalViews: 0, totalClicks: 0, totalCompletions: 0, totalEngagementPoints: 0, status: 'active', featured: true, priority: 6, expiresAt: new Date()
    },
    {
        id: 'pr-003',
        title: 'Huawei Watch GT 4 46mm - Black',
        titleAr: 'ساعة هواوي جي تي 4 46 مم - أسود',
        description: 'Up to 2 weeks battery life, diverse workout modes.',
        image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&fit=crop',
        productUrl: 'https://sa.pricena.com/en/search/?s=huawei+watch+gt+4',
        category: 'electronics/wearables/smartwatch',
        source: 'pricena', verified: true,
        originalPrice: 999, discountedPrice: 749, currency: 'SAR',
        cpcRate: 0.80, cpcCost: 0.16, campaignBudget: 150, safyCosts: 30,
        totalViews: 0, totalClicks: 0, totalCompletions: 0, totalEngagementPoints: 0, status: 'active', featured: false, priority: 5, expiresAt: new Date()
    },
    {
        id: 'pr-004',
        title: 'Anker Soundcore Life Q30 Headphones',
        titleAr: 'سماعات أنكر ساوند كور لايف كيو 30',
        description: 'Hybrid active noise cancelling, Hi-Res audio.',
        image: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=800&fit=crop',
        productUrl: 'https://sa.pricena.com/en/search/?s=anker+soundcore+life+q30',
        category: 'electronics/audio/headphones',
        source: 'pricena', verified: true,
        originalPrice: 349, discountedPrice: 229, currency: 'SAR',
        cpcRate: 0.50, cpcCost: 0.10, campaignBudget: 100, safyCosts: 20,
        totalViews: 0, totalClicks: 0, totalCompletions: 0, totalEngagementPoints: 0, status: 'active', featured: false, priority: 5, expiresAt: new Date()
    },
    {
        id: 'pr-005',
        title: 'Logitech MX Master 3S Performance Mouse',
        titleAr: 'ماوس لوجيتك ام اكس ماستر 3 اس',
        description: '8K DPI tracking, quiet clicks, ergonomic design.',
        image: 'https://images.unsplash.com/photo-1615663245857-acda847041dc?w=800&fit=crop',
        productUrl: 'https://sa.pricena.com/en/search/?s=logitech+mx+master+3s',
        category: 'electronics/computers/accessories',
        source: 'pricena', verified: true,
        originalPrice: 499, discountedPrice: 399, currency: 'SAR',
        cpcRate: 0.60, cpcCost: 0.12, campaignBudget: 100, safyCosts: 20,
        totalViews: 0, totalClicks: 0, totalCompletions: 0, totalEngagementPoints: 0, status: 'active', featured: false, priority: 4, expiresAt: new Date()
    },
    {
        id: 'pr-006',
        title: 'Xiaomi Mi Air Fryer 3.5L',
        titleAr: 'قلاية هوائية شاومي مي 3.5 لتر',
        description: 'Oil-free cooking, OLED touch screen.',
        image: 'https://images.unsplash.com/photo-1626202158869-27055a6d3f2c?w=800&fit=crop',
        productUrl: 'https://sa.pricena.com/en/search/?s=xiaomi+air+fryer',
        category: 'home-appliances/kitchen/small',
        source: 'pricena', verified: true,
        originalPrice: 299, discountedPrice: 199, currency: 'SAR',
        cpcRate: 0.50, cpcCost: 0.10, campaignBudget: 100, safyCosts: 20,
        totalViews: 0, totalClicks: 0, totalCompletions: 0, totalEngagementPoints: 0, status: 'active', featured: false, priority: 4, expiresAt: new Date()
    },
    {
        id: 'pr-007',
        title: 'Canon EOS 4000D DSLR Camera',
        titleAr: 'كاميرا كانون اي او اس 4000 دي',
        description: '18MP, Wi-Fi, Full HD video.',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&fit=crop',
        productUrl: 'https://sa.pricena.com/en/search/?s=canon+eos+4000d',
        category: 'electronics/cameras',
        source: 'pricena', verified: true,
        originalPrice: 1699, discountedPrice: 1299, currency: 'SAR',
        cpcRate: 0.90, cpcCost: 0.18, campaignBudget: 200, safyCosts: 40,
        totalViews: 0, totalClicks: 0, totalCompletions: 0, totalEngagementPoints: 0, status: 'active', featured: false, priority: 5, expiresAt: new Date()
    },
    {
        id: 'pr-008',
        title: 'JBL Flip 6 Portable Bluetooth Speaker',
        titleAr: 'سماعة جي بي ال فليب 6 بلوتوث',
        description: 'Bold sound, waterproof, 12 hours playtime.',
        image: 'https://images.unsplash.com/photo-1612444530582-fc66183b16f7?w=800&fit=crop',
        productUrl: 'https://sa.pricena.com/en/search/?s=jbl+flip+6',
        category: 'electronics/audio/speakers',
        source: 'pricena', verified: true,
        originalPrice: 449, discountedPrice: 349, currency: 'SAR',
        cpcRate: 0.55, cpcCost: 0.11, campaignBudget: 100, safyCosts: 20,
        totalViews: 0, totalClicks: 0, totalCompletions: 0, totalEngagementPoints: 0, status: 'active', featured: false, priority: 4, expiresAt: new Date()
    },
    {
        id: 'pr-009',
        title: 'Tefal Ingenio Unlimited 13-Piece Set',
        titleAr: 'طقم قدور تيفال انجينيو 13 قطعة',
        description: 'Stackable design, titanium anti-scratch coating.',
        image: 'https://images.unsplash.com/photo-1584990347449-edad1e6456e3?w=800&fit=crop',
        productUrl: 'https://sa.pricena.com/en/search/?s=tefal+ingenio',
        category: 'home-appliances/kitchen/cookware',
        source: 'pricena', verified: true,
        originalPrice: 999, discountedPrice: 599, currency: 'SAR',
        cpcRate: 0.70, cpcCost: 0.14, campaignBudget: 150, safyCosts: 30,
        totalViews: 0, totalClicks: 0, totalCompletions: 0, totalEngagementPoints: 0, status: 'active', featured: false, priority: 4, expiresAt: new Date()
    },
    {
        id: 'pr-010',
        title: 'Fitbit Charge 6 Fitness Tracker',
        titleAr: 'سوار لياقة فيت بيت شارج 6',
        description: 'Heart rate, GPS, sleep tracking, Google apps.',
        image: 'https://images.unsplash.com/photo-1557935728-e6d1eaed5539?w=800&fit=crop',
        productUrl: 'https://sa.pricena.com/en/search/?s=fitbit+charge+6',
        category: 'electronics/wearables/fitness',
        source: 'pricena', verified: true,
        originalPrice: 749, discountedPrice: 599, currency: 'SAR',
        cpcRate: 0.65, cpcCost: 0.13, campaignBudget: 100, safyCosts: 20,
        totalViews: 0, totalClicks: 0, totalCompletions: 0, totalEngagementPoints: 0, status: 'active', featured: false, priority: 4, expiresAt: new Date()
    }
];

export const getCampaignsByInterests = (interests: string[]): AdCampaign[] => {
    if (!interests || interests.length === 0) return MOCK_CAMPAIGNS; // show all if no interests

    const matching = MOCK_CAMPAIGNS.filter(c =>
        interests.some(i => c.category === i || c.category.startsWith(i + '/'))
    );

    const result = matching.length > 0 ? matching : MOCK_CAMPAIGNS;

    return result.sort((a, b) =>
        a.priority !== b.priority
            ? b.priority - a.priority
            : calculateRewardPool(b.campaignBudget, b.safyCosts) - calculateRewardPool(a.campaignBudget, a.safyCosts)
    );
};

export const getCampaignById = (id: string): AdCampaign | undefined =>
    MOCK_CAMPAIGNS.find(c => c.id === id);
