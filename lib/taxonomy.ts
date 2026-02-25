export interface InterestCategory {
  id: string;
  label: string;
  icon: string;
  children?: InterestCategory[];
}

export const INTEREST_TAXONOMY: InterestCategory[] = [
  {
    id: "food_and_restaurants",
    label: "الأكل والمطاعم",
    icon: "🍔",
    children: [
      { id: "shawarma", label: "شاورما", icon: "🌯" },
      { id: "burger", label: "برجر", icon: "🍔" },
      { id: "pizza", label: "بيتزا", icon: "🍕" },
      { id: "grills", label: "مشويات", icon: "🍢" },
      { id: "bukhari_mandi", label: "بخاري ومندي", icon: "🍛" },
      { id: "coffee", label: "قهوة وكافيهات", icon: "☕" },
      { id: "sweets", label: "حلويات وكوكيز", icon: "🍪" },
      { id: "healthy", label: "أكل صحي ودايت", icon: "🥗" },
      { id: "seafood", label: "مأكولات بحرية", icon: "🍤" },
    ],
  },
  {
    id: "electronics",
    label: "إلكترونيات وجوالات",
    icon: "📱",
    children: [
      { id: "smartphones", label: "جوالات", icon: "📱" },
      { id: "laptops", label: "لابتوب وكمبيوتر", icon: "💻" },
      { id: "accessories", label: "إكسسوارات ذكية", icon: "🎧" },
    ],
  },
  {
    id: "fashion",
    label: "أزياء وملابس",
    icon: "👕",
    children: [
      { id: "mens_fashion", label: "رجالي", icon: "👔" },
      { id: "womens_fashion", label: "نسائي", icon: "👗" },
      { id: "shoes", label: "أحذية وشنط", icon: "👞" },
    ],
  },
  {
    id: "health_beauty",
    label: "صحة وعناية",
    icon: "✨",
    children: [
      { id: "perfumes", label: "عطور", icon: "🧴" },
      { id: "clinics", label: "عيادات تجميل", icon: "🏥" },
      { id: "pharmacy", label: "صيدليات", icon: "💊" },
    ],
  },
];

export const flattenTaxonomy = (taxonomy: InterestCategory[]): InterestCategory[] => {
  let flat: InterestCategory[] = [];
  taxonomy.forEach((item) => {
    flat.push(item);
    if (item.children) {
      flat = flat.concat(flattenTaxonomy(item.children));
    }
  });
  return flat;
};

export const searchTaxonomy = (query: string, taxonomy: InterestCategory[]): InterestCategory[] => {
  const normalizedQuery = query.toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه');
  return taxonomy.map(category => {
    const categoryName = category.label.toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه');
    const match = categoryName.includes(normalizedQuery);
    let matchingChildren: InterestCategory[] = [];
    
    if (category.children) {
      matchingChildren = searchTaxonomy(query, category.children);
    }
    
    if (match || matchingChildren.length > 0) {
      return { ...category, children: matchingChildren.length > 0 ? matchingChildren : category.children };
    }
    return null;
  }).filter(Boolean) as InterestCategory[];
};

export const getCategoryPath = (categoryId: string, taxonomy: InterestCategory[] = INTEREST_TAXONOMY, currentPath: string[] = []): string[] => {
  for (const category of taxonomy) {
    if (category.id === categoryId) {
      return [...currentPath, category.label];
    }
    if (category.children) {
      const path = getCategoryPath(categoryId, category.children, [...currentPath, category.label]);
      if (path.length > 0) return path;
    }
  }
  return [];
};