// Deep Interest Taxonomy for SAFY
// Inspired by Noon, Amazon, Jarir, and Extra

export interface InterestCategory {
    id: string;
    label: string;
    labelAr: string;
    icon: string;
    children?: InterestCategory[];
}

export const INTEREST_TAXONOMY: InterestCategory[] = [
    {
        id: "electronics",
        label: "Electronics",
        labelAr: "إلكترونيات",
        icon: "💻",
        children: [
            {
                id: "electronics/computers",
                label: "Computers & Laptops",
                labelAr: "أجهزة كمبيوتر ولابتوب",
                icon: "💻",
                children: [
                    { id: "electronics/computers/laptops", label: "Laptops", labelAr: "لابتوب", icon: "💻" },
                    { id: "electronics/computers/desktops", label: "Desktop PCs", labelAr: "أجهزة كمبيوتر مكتبية", icon: "🖥️" },
                    { id: "electronics/computers/accessories", label: "Computer Accessories", labelAr: "ملحقات الكمبيوتر", icon: "⌨️" },
                ]
            },
            {
                id: "electronics/mobiles",
                label: "Mobile Phones & Tablets",
                labelAr: "هواتف وأجهزة لوحية",
                icon: "📱",
                children: [
                    { id: "electronics/mobiles/smartphones", label: "Smartphones", labelAr: "هواتف ذكية", icon: "📱" },
                    { id: "electronics/mobiles/tablets", label: "Tablets", labelAr: "أجهزة لوحية", icon: "📱" },
                    { id: "electronics/mobiles/accessories", label: "Mobile Accessories", labelAr: "ملحقات الجوال", icon: "🔌" },
                ]
            },
            {
                id: "electronics/audio",
                label: "Audio & Headphones",
                labelAr: "صوتيات وسماعات",
                icon: "🎧",
                children: [
                    { id: "electronics/audio/headphones", label: "Headphones", labelAr: "سماعات رأس", icon: "🎧" },
                    { id: "electronics/audio/speakers", label: "Speakers", labelAr: "مكبرات صوت", icon: "🔊" },
                    { id: "electronics/audio/earbuds", label: "Wireless Earbuds", labelAr: "سماعات لاسلكية", icon: "🎧" },
                ]
            },
            {
                id: "electronics/cameras",
                label: "Cameras & Photography",
                labelAr: "كاميرات وتصوير",
                icon: "📷",
                children: [
                    { id: "electronics/cameras/dslr", label: "DSLR Cameras", labelAr: "كاميرات DSLR", icon: "📷" },
                    { id: "electronics/cameras/action", label: "Action Cameras", labelAr: "كاميرات أكشن", icon: "📹" },
                    { id: "electronics/cameras/accessories", label: "Camera Accessories", labelAr: "ملحقات الكاميرا", icon: "🎥" },
                ]
            },
        ]
    },
    {
        id: "home-appliances",
        label: "Home Appliances",
        labelAr: "أجهزة منزلية",
        icon: "🏠",
        children: [
            {
                id: "home-appliances/kitchen",
                label: "Kitchen Appliances",
                labelAr: "أجهزة المطبخ",
                icon: "🍳",
                children: [
                    { id: "home-appliances/kitchen/coffee", label: "Coffee Makers", labelAr: "صانعات القهوة", icon: "☕" },
                    { id: "home-appliances/kitchen/blenders", label: "Blenders & Mixers", labelAr: "خلاطات", icon: "🥤" },
                    { id: "home-appliances/kitchen/microwaves", label: "Microwaves", labelAr: "ميكروويف", icon: "📦" },
                    { id: "home-appliances/kitchen/refrigerators", label: "Refrigerators", labelAr: "ثلاجات", icon: "🧊" },
                ]
            },
            {
                id: "home-appliances/cleaning",
                label: "Cleaning Appliances",
                labelAr: "أجهزة التنظيف",
                icon: "🧹",
                children: [
                    { id: "home-appliances/cleaning/vacuums", label: "Vacuum Cleaners", labelAr: "مكانس كهربائية", icon: "🧹" },
                    { id: "home-appliances/cleaning/washers", label: "Washing Machines", labelAr: "غسالات", icon: "🌀" },
                    { id: "home-appliances/cleaning/dryers", label: "Dryers", labelAr: "نشافات", icon: "💨" },
                ]
            },
            {
                id: "home-appliances/climate",
                label: "Climate Control",
                labelAr: "التحكم بالمناخ",
                icon: "❄️",
                children: [
                    { id: "home-appliances/climate/ac", label: "Air Conditioners", labelAr: "مكيفات هواء", icon: "❄️" },
                    { id: "home-appliances/climate/fans", label: "Fans", labelAr: "مراوح", icon: "🌀" },
                    { id: "home-appliances/climate/heaters", label: "Heaters", labelAr: "سخانات", icon: "🔥" },
                ]
            },
        ]
    },
    {
        id: "grocery",
        label: "Supermarket & Grocery",
        labelAr: "سوبر ماركت وبقالة",
        icon: "🛒",
        children: [
            {
                id: "grocery/food",
                label: "Food & Beverages",
                labelAr: "طعام ومشروبات",
                icon: "🍔",
                children: [
                    { id: "grocery/food/snacks", label: "Snacks", labelAr: "وجبات خفيفة", icon: "🍿" },
                    { id: "grocery/food/beverages", label: "Beverages", labelAr: "مشروبات", icon: "🥤" },
                    { id: "grocery/food/dairy", label: "Dairy Products", labelAr: "منتجات الألبان", icon: "🥛" },
                    { id: "grocery/food/frozen", label: "Frozen Foods", labelAr: "أطعمة مجمدة", icon: "🧊" },
                ]
            },
            {
                id: "grocery/personal-care",
                label: "Personal Care",
                labelAr: "العناية الشخصية",
                icon: "🧴",
                children: [
                    { id: "grocery/personal-care/skincare", label: "Skincare", labelAr: "العناية بالبشرة", icon: "🧴" },
                    { id: "grocery/personal-care/haircare", label: "Hair Care", labelAr: "العناية بالشعر", icon: "💇" },
                    { id: "grocery/personal-care/hygiene", label: "Hygiene Products", labelAr: "منتجات النظافة", icon: "🧼" },
                ]
            },
            {
                id: "grocery/household",
                label: "Household Essentials",
                labelAr: "مستلزمات منزلية",
                icon: "🧽",
                children: [
                    { id: "grocery/household/cleaning", label: "Cleaning Supplies", labelAr: "مستلزمات التنظيف", icon: "🧽" },
                    { id: "grocery/household/paper", label: "Paper Products", labelAr: "منتجات ورقية", icon: "🧻" },
                    { id: "grocery/household/storage", label: "Storage & Organization", labelAr: "تخزين وتنظيم", icon: "📦" },
                ]
            },
        ]
    },
    {
        id: "fashion",
        label: "Fashion & Beauty",
        labelAr: "أزياء وجمال",
        icon: "👔",
        children: [
            {
                id: "fashion/clothing",
                label: "Clothing",
                labelAr: "ملابس",
                icon: "👕",
                children: [
                    { id: "fashion/clothing/men", label: "Men's Clothing", labelAr: "ملابس رجالية", icon: "👔" },
                    { id: "fashion/clothing/women", label: "Women's Clothing", labelAr: "ملابس نسائية", icon: "👗" },
                    { id: "fashion/clothing/kids", label: "Kids' Clothing", labelAr: "ملابس أطفال", icon: "👶" },
                ]
            },
            {
                id: "fashion/shoes",
                label: "Shoes & Footwear",
                labelAr: "أحذية",
                icon: "👟",
                children: [
                    { id: "fashion/shoes/sneakers", label: "Sneakers", labelAr: "أحذية رياضية", icon: "👟" },
                    { id: "fashion/shoes/formal", label: "Formal Shoes", labelAr: "أحذية رسمية", icon: "👞" },
                    { id: "fashion/shoes/sandals", label: "Sandals", labelAr: "صنادل", icon: "🩴" },
                ]
            },
            {
                id: "fashion/beauty",
                label: "Beauty & Cosmetics",
                labelAr: "جمال ومستحضرات تجميل",
                icon: "💄",
                children: [
                    { id: "fashion/beauty/makeup", label: "Makeup", labelAr: "مكياج", icon: "💄" },
                    { id: "fashion/beauty/fragrance", label: "Fragrances", labelAr: "عطور", icon: "🌸" },
                    { id: "fashion/beauty/skincare", label: "Skincare", labelAr: "العناية بالبشرة", icon: "✨" },
                ]
            },
            {
                id: "fashion/accessories",
                label: "Accessories",
                labelAr: "إكسسوارات",
                icon: "⌚",
                children: [
                    { id: "fashion/accessories/watches", label: "Watches", labelAr: "ساعات", icon: "⌚" },
                    { id: "fashion/accessories/jewelry", label: "Jewelry", labelAr: "مجوهرات", icon: "💍" },
                    { id: "fashion/accessories/bags", label: "Bags & Wallets", labelAr: "حقائب ومحافظ", icon: "👜" },
                ]
            },
        ]
    },
    {
        id: "entertainment",
        label: "Entertainment & Gaming",
        labelAr: "ترفيه وألعاب",
        icon: "🎮",
        children: [
            {
                id: "entertainment/gaming",
                label: "Gaming",
                labelAr: "ألعاب فيديو",
                icon: "🎮",
                children: [
                    { id: "entertainment/gaming/consoles", label: "Gaming Consoles", labelAr: "أجهزة ألعاب", icon: "🎮" },
                    { id: "entertainment/gaming/games", label: "Video Games", labelAr: "ألعاب فيديو", icon: "🕹️" },
                    { id: "entertainment/gaming/accessories", label: "Gaming Accessories", labelAr: "ملحقات الألعاب", icon: "🎧" },
                ]
            },
            {
                id: "entertainment/media",
                label: "Movies & Music",
                labelAr: "أفلام وموسيقى",
                icon: "🎬",
                children: [
                    { id: "entertainment/media/streaming", label: "Streaming Devices", labelAr: "أجهزة البث", icon: "📺" },
                    { id: "entertainment/media/music", label: "Music Instruments", labelAr: "آلات موسيقية", icon: "🎸" },
                ]
            },
            {
                id: "entertainment/toys",
                label: "Toys & Hobbies",
                labelAr: "ألعاب وهوايات",
                icon: "🧸",
                children: [
                    { id: "entertainment/toys/kids", label: "Kids' Toys", labelAr: "ألعاب أطفال", icon: "🧸" },
                    { id: "entertainment/toys/collectibles", label: "Collectibles", labelAr: "مقتنيات", icon: "🎁" },
                ]
            },
        ]
    },
    {
        id: "sports",
        label: "Sports & Outdoors",
        labelAr: "رياضة وأنشطة خارجية",
        icon: "⚽",
        children: [
            {
                id: "sports/fitness",
                label: "Fitness Equipment",
                labelAr: "معدات اللياقة",
                icon: "🏋️",
                children: [
                    { id: "sports/fitness/cardio", label: "Cardio Equipment", labelAr: "معدات كارديو", icon: "🏃" },
                    { id: "sports/fitness/weights", label: "Weights & Strength", labelAr: "أوزان وقوة", icon: "🏋️" },
                    { id: "sports/fitness/yoga", label: "Yoga & Pilates", labelAr: "يوغا وبيلاتس", icon: "🧘" },
                ]
            },
            {
                id: "sports/outdoor",
                label: "Outdoor Activities",
                labelAr: "أنشطة خارجية",
                icon: "🏕️",
                children: [
                    { id: "sports/outdoor/camping", label: "Camping Gear", labelAr: "معدات التخييم", icon: "⛺" },
                    { id: "sports/outdoor/cycling", label: "Cycling", labelAr: "ركوب الدراجات", icon: "🚴" },
                ]
            },
            {
                id: "food-restaurants",
                label: "Food & Restaurants",
                labelAr: "مطاعم ووجبات",
                icon: "🍔",
                children: [
                    {
                        id: "food-restaurants/delivery",
                        label: "Delivery",
                        labelAr: "توصيل",
                        icon: "🛵",
                    },
                    {
                        id: "food-restaurants/dine-in",
                        label: "Dine-in",
                        labelAr: "محلي (بدون توصيل)",
                        icon: "🍽️",
                    }
                ]
            }
        ]
    }
];

// Helper function to flatten taxonomy for search
export function flattenTaxonomy(categories: InterestCategory[], parentPath = ""): InterestCategory[] {
    let result: InterestCategory[] = [];

    for (const category of categories) {
        result.push(category);

        if (category.children) {
            result = result.concat(flattenTaxonomy(category.children, category.id));
        }
    }

    return result;
}

// Helper function to search taxonomy
export function searchTaxonomy(query: string, categories: InterestCategory[]): InterestCategory[] {
    const lowerQuery = query.toLowerCase();
    const flatCategories = flattenTaxonomy(categories);

    return flatCategories.filter(cat =>
        cat.label.toLowerCase().includes(lowerQuery) ||
        cat.labelAr.includes(query) ||
        cat.id.toLowerCase().includes(lowerQuery)
    );
}

// Helper function to get category path (breadcrumb)
export function getCategoryPath(categoryId: string): string[] {
    return categoryId.split('/');
}

// Helper function to get parent category ID
export function getParentCategoryId(categoryId: string): string | null {
    const parts = categoryId.split('/');
    if (parts.length <= 1) return null;
    return parts.slice(0, -1).join('/');
}
