import { Campaign, Merchant } from "./types";

export const mockAds = [
    { id: 'r_deep_0', title: 'مطعم الكبسة الشامية', advertiser: 'مطعم الكبسة الشامية - حي السليمانية', category: 'مطاعم ووجبات', reward: 1.0, distance: 0, lat: 24.6983, lng: 46.6999, imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=500', actionText: 'الاتجاهات', discountPercentage: 20 },
    { id: 'r_deep_1', title: 'شاورما صح', advertiser: 'شاورما صح - حي الخليج', category: 'مطاعم ووجبات', reward: 1.5, distance: 0, lat: 24.7617, lng: 46.8016, imageUrl: 'https://images.unsplash.com/photo-1529144415895-6aaf8be872fb?q=80&w=500', actionText: 'اطلب الآن', discountPercentage: 10 },
    { id: 'r_deep_2', title: 'مطعم الرومانسية', advertiser: 'مطعم الرومانسية - حي الأندلس', category: 'مطاعم ووجبات', reward: 2.0, distance: 0, lat: 24.7434, lng: 46.7886, imageUrl: 'https://images.unsplash.com/photo-1626200926733-611385494d49?q=80&w=500', actionText: 'الاتجاهات', discountPercentage: 30 },
    { id: 'r_deep_3', title: 'فوال الطايف', advertiser: 'فوال الطايف - حي الورود', category: 'مطاعم ووجبات', reward: 0.5, distance: 0, lat: 24.7233, lng: 46.676, imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=500', actionText: 'الاتجاهات', discountPercentage: 40 },
    { id: 'r_deep_4', title: 'مطعم سمرقندي بخاري', advertiser: 'مطعم سمرقندي بخاري - حي الخليج', category: 'مطاعم ووجبات', reward: 1.5, distance: 0, lat: 24.7601, lng: 46.8052, imageUrl: 'https://images.unsplash.com/photo-1626200926733-611385494d49?q=80&w=500', actionText: 'الاتجاهات', discountPercentage: 20 },
    { id: 'r_deep_5', title: 'برجر كنج', advertiser: 'برجر كنج - حي السليمانية', category: 'مطاعم ووجبات', reward: 2.0, distance: 0, lat: 24.6971, lng: 46.7021, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500', actionText: 'اطلب الآن', discountPercentage: 10 },
    { id: 'r_deep_6', title: 'مشويات العنابي', advertiser: 'مشويات العنابي - حي الخليج', category: 'مطاعم ووجبات', reward: 1.0, distance: 0, lat: 24.7635, lng: 46.8001, imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=500', actionText: 'الاتجاهات', discountPercentage: 30 },
    { id: 'r_deep_7', title: 'دوز كافيه', advertiser: 'دوز كافيه - حي الأندلس', category: 'مطاعم ووجبات', reward: 0.5, distance: 0, lat: 24.7451, lng: 46.7892, imageUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=500', actionText: 'الاتجاهات', discountPercentage: 40 },
    { id: 'r_deep_8', title: 'شاورمر', advertiser: 'شاورمر - حي الورود', category: 'مطاعم ووجبات', reward: 1.5, distance: 0, lat: 24.7255, lng: 46.6741, imageUrl: 'https://images.unsplash.com/photo-1529144415895-6aaf8be872fb?q=80&w=500', actionText: 'اطلب الآن', discountPercentage: 20 },
    { id: 'r_deep_9', title: 'مطعم بيت الشواية', advertiser: 'مطعم بيت الشواية - حي الخليج', category: 'مطاعم ووجبات', reward: 1.0, distance: 0, lat: 24.7622, lng: 46.8044, imageUrl: 'https://images.unsplash.com/photo-1626200926733-611385494d49?q=80&w=500', actionText: 'الاتجاهات', discountPercentage: 10 },
    { id: 'r_deep_10', title: 'مطاعم السدة', advertiser: 'مطاعم السدة - حي السليمانية', category: 'مطاعم ووجبات', reward: 2.0, distance: 0, lat: 24.6995, lng: 46.6981, imageUrl: 'https://images.unsplash.com/photo-1626200926733-611385494d49?q=80&w=500', actionText: 'الاتجاهات', discountPercentage: 30 },
    { id: 'r_deep_11', title: 'بوفيه الأمانة', advertiser: 'بوفيه الأمانة - حي الخليج', category: 'مطاعم ووجبات', reward: 0.5, distance: 0, lat: 24.7641, lng: 46.8022, imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=500', actionText: 'الاتجاهات', discountPercentage: 40 },
    { id: 'r_deep_12', title: 'مطعم النافورة', advertiser: 'مطعم النافورة - حي الأندلس', category: 'مطاعم ووجبات', reward: 1.5, distance: 0, lat: 24.7411, lng: 46.7871, imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=500', actionText: 'الاتجاهات', discountPercentage: 20 },
    { id: 'r_deep_13', title: 'ماكدونالدز', advertiser: 'ماكدونالدز - حي الورود', category: 'مطاعم ووجبات', reward: 1.0, distance: 0, lat: 24.7212, lng: 46.6788, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500', actionText: 'اطلب الآن', discountPercentage: 10 },
    { id: 'r_deep_14', title: 'فلافل ثمار', advertiser: 'فلافل ثمار - حي الخليج', category: 'مطاعم ووجبات', reward: 0.5, distance: 0, lat: 24.7605, lng: 46.8088, imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=500', actionText: 'الاتجاهات', discountPercentage: 30 },
    { id: 'r_deep_15', title: 'مطعم سمرقند بخاري', advertiser: 'مطعم سمرقند بخاري - حي الورود', category: 'مطاعم ووجبات', reward: 1.5, distance: 0, lat: 24.7244, lng: 46.6755, imageUrl: 'https://images.unsplash.com/photo-1626200926733-611385494d49?q=80&w=500', actionText: 'الاتجاهات', discountPercentage: 40 },
    { id: 'r_deep_16', title: 'شاورما جليلة', advertiser: 'شاورما جليلة - حي الأندلس', category: 'مطاعم ووجبات', reward: 1.0, distance: 0, lat: 24.7444, lng: 46.7866, imageUrl: 'https://images.unsplash.com/photo-1529144415895-6aaf8be872fb?q=80&w=500', actionText: 'اطلب الآن', discountPercentage: 20 },
    { id: 'r_deep_17', title: 'مطعم القرموشي', advertiser: 'مطعم القرموشي - حي الخليج', category: 'مطاعم ووجبات', reward: 2.0, distance: 0, lat: 24.7655, lng: 46.8055, imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=500', actionText: 'الاتجاهات', discountPercentage: 10 },
    { id: 'r_deep_18', title: 'هامبرغيني', advertiser: 'هامبرغيني - حي السليمانية', category: 'مطاعم ووجبات', reward: 1.5, distance: 0, lat: 24.6966, lng: 46.7033, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500', actionText: 'اطلب الآن', discountPercentage: 30 },
    { id: 'r_deep_19', title: 'مطعم شواية الخليج', advertiser: 'مطعم شواية الخليج - حي الخليج', category: 'مطاعم ووجبات', reward: 1.0, distance: 0, lat: 24.7611, lng: 46.8099, imageUrl: 'https://images.unsplash.com/photo-1626200926733-611385494d49?q=80&w=500', actionText: 'الاتجاهات', discountPercentage: 40 },
    { id: 'r_deep_20', title: 'مطعم بخاري المائدة', advertiser: 'مطعم بخاري المائدة - حي السليمانية', category: 'مطاعم ووجبات', reward: 2.0, distance: 0, lat: 24.6955, lng: 46.7044, imageUrl: 'https://images.unsplash.com/photo-1626200926733-611385494d49?q=80&w=500', actionText: 'الاتجاهات', discountPercentage: 20 },
    { id: 'r_deep_21', title: 'بيتزا هت', advertiser: 'بيتزا هت - حي الخليج', category: 'مطاعم ووجبات', reward: 1.5, distance: 0, lat: 24.7677, lng: 46.8011, imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=500', actionText: 'اطلب الآن', discountPercentage: 10 }
];

export const MOCK_MERCHANTS: Record<string, Merchant> = {};
export const MOCK_CAMPAIGNS: Campaign[] = [];

mockAds.forEach((ad) => {
    MOCK_MERCHANTS[ad.id] = {
        id: ad.id,
        name: ad.advertiser,
        logo: ad.imageUrl,
        category: ad.category,
        overall_likes: Math.floor(Math.random() * 5000) + 1000,
        overall_dislikes: Math.floor(Math.random() * 300) + 50
    };

    MOCK_CAMPAIGNS.push({
        id: `c_${ad.id}`,
        merchant_id: ad.id,
        title: ad.title,
        video_url: ad.imageUrl,
        lat: ad.lat,
        lng: ad.lng,
        discountPercentage: ad.discountPercentage,
        cpc_value: ad.reward,
        bounty_budget: ad.reward > 1 ? 25000 : 0,
        bounty_reward: ad.reward * 100,
        actionText: ad.actionText,
        is_active: true
    });
});

export const FALLBACK_LOCATION = { lat: 24.7136, lng: 46.6753 };
