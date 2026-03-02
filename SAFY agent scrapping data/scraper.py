import googlemaps
import pandas as pd
import google.generativeai as genai
import time

# 1. إعداد مفاتيح الـ API الخاصة بك
GMAPS_API_KEY = 'AIzaSyBGQs8l-2MCNs_7XJ9znkSpovWtZZCRxEc'
GEMINI_API_KEY = 'AIzaSyC_zns2_3A9WLRb24dXvuLH3KQy_GctGdE'

gmaps = googlemaps.Client(key=GMAPS_API_KEY)
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

# 2. قائمة أحياء الرياض المستهدفة (الخليج، السليمانية، الورود، الأندلس)
neighborhoods = [
    {"name": "حي الخليج", "location": (24.7617, 46.8016), "radius": 2000},
    {"name": "حي السليمانية", "location": (24.6983, 46.6999), "radius": 2000},
    {"name": "حي الورود", "location": (24.7233, 46.6760), "radius": 2000},
    {"name": "حي الأندلس", "location": (24.7434, 46.7886), "radius": 2000}
]

# الكلمات المفتاحية عشان نصطاد المطاعم المحلية والشعبية بكل أحجامها
search_keywords = ["مطعم", "بخاري", "شاورما", "فول", "فلافل", "مشويات", "بوفيه", "مقهى", "برجر"]

# 3. وكيل الذكاء الاصطناعي (AI Agent) للتصنيف
def classify_restaurant_with_ai(name, address):
    prompt = f"""
    أنت خبير في مطاعم السعودية. 
    اسم المطعم: {name}
    العنوان: {address}
    
    بناءً على الاسم، صنف هذا المطعم في كلمة أو كلمتين كحد أقصى.
    اكتب التصنيف فقط بدون أي شرح إضافي:
    """
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return "عام"

# 4. محرك البحث والجمع العميق (Deep Crawler)
all_restaurants = []
seen_place_ids = set() # مصفاة لمنع تكرار المطاعم

for nb in neighborhoods:
    print(f"\n📍 جاري المسح العميق في {nb['name']}...")
    
    for keyword in search_keywords:
        print(f"  🔍 جاري البحث عن: {keyword}...")
        next_page_token = None
        
        while True:
            try:
                # جوجل بيطلب انتظار ثانيتين قبل طلب الصفحة التالية
                if next_page_token:
                    time.sleep(2)
                    places_result = gmaps.places_nearby(page_token=next_page_token)
                else:
                    places_result = gmaps.places_nearby(
                        location=nb['location'],
                        radius=nb['radius'],
                        keyword=keyword,
                        language='ar'
                    )
                
                for place in places_result.get('results', []):
                    place_id = place.get('place_id')
                    
                    # لو المطعم متسجل قبل كده، تجاهله
                    if place_id in seen_place_ids:
                        continue
                    
                    seen_place_ids.add(place_id)
                    
                    name = place.get('name')
                    address = place.get('vicinity', 'غير متوفر')
                    rating = place.get('rating', 0)
                    user_ratings_total = place.get('user_ratings_total', 0)
                    lat = place['geometry']['location']['lat']
                    lng = place['geometry']['location']['lng']
                    
                    print(f"    🍔 اصطياد: {name}")
                    
                    # تصنيف المطعم بالذكاء الاصطناعي
                    category = classify_restaurant_with_ai(name, address)
                    
                    all_restaurants.append({
                        "الحي": nb['name'],
                        "اسم المطعم": name,
                        "التصنيف (AI)": category,
                        "الكلمة المفتاحية للبحث": keyword,
                        "التقييم": rating,
                        "عدد المراجعات": user_ratings_total,
                        "خط العرض": lat,
                        "خط الطول": lng,
                        "العنوان": address
                    })
                
                # التحقق من وجود صفحة تالية
                next_page_token = places_result.get('next_page_token')
                if not next_page_token:
                    break
                    
            except Exception as e:
                print(f"❌ خطأ أثناء البحث عن {keyword}: {e}")
                break

# 5. حفظ البيانات في ملف إكسيل
if all_restaurants:
    df = pd.DataFrame(all_restaurants)
    df.to_excel("riyadh_deep_restaurants.xlsx", index=False)
    print(f"\n✅ مبروك! تم جمع {len(all_restaurants)} مطعم بنجاح وحفظهم في riyadh_deep_restaurants.xlsx")
else:
    print("⚠️ لم يتم العثور على بيانات.")