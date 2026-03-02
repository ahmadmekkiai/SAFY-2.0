import pandas as pd
import requests
import time
import os

# مفتاح جوجل بتاعك
API_KEY = 'AIzaSyBGQs8l-2MCNs_7XJ9znkSpovWtZZCRxEc'

# إحداثيات مركزية للرياض للبحث حواليها
RIYADH_LOCATION = '24.7136,46.6753' 
RADIUS = '50000' 

def get_place_details(place_name):
    search_url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query={place_name}+Riyadh&location={RIYADH_LOCATION}&radius={RADIUS}&key={API_KEY}"
    response = requests.get(search_url).json()
    
    if response.get('status') == 'OK' and len(response.get('results', [])) > 0:
        place = response['results'][0]
        rating = place.get('rating', 0)
        user_ratings_total = place.get('user_ratings_total', 0)
        
        photo_url = ""
        if 'photos' in place:
            photo_ref = place['photos'][0]['photo_reference']
            photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference={photo_ref}&key={API_KEY}"
            
        return {
            'rating': rating,
            'user_ratings_total': user_ratings_total,
            'photo_url': photo_url,
            'lat': place['geometry']['location']['lat'],
            'lng': place['geometry']['location']['lng'],
            'address': place.get('formatted_address', '')
        }
    return None

def main():
    input_file = 'data.csv'
    output_file = 'data_with_images.csv'

    # لو ملقاش الملف، هيطبعلك الملفات اللي في الفولدر عشان نكشف الاسم الحقيقي
    if not os.path.exists(input_file):
        print(f"❌ مش لاقي الملف اللي اسمه '{input_file}'.")
        print("💡 الملفات اللي بصيغة CSV في الفولدر ده هي:")
        for file in os.listdir():
            if file.endswith('.csv'):
                print(f"   - {file}")
        print("👉 يرجى تغيير اسم ملفك إلى 'data.csv' أو تعديل الاسم في الكود.")
        return

    print("✅ جاري قراءة الملف...")
    # بنضيف encoding عشان يقرأ العربي بدون مشاكل
    df = pd.read_csv(input_file, encoding='utf-8') 

    results = []
    # هنجرب على أول 10 مطاعم
    for index, row in df[:10].iterrows():
        name = str(row.get('title', ''))
        if not name or name == 'nan':
            continue
            
        print(f"🔍 جاري البحث عن: {name}...")
        
        details = get_place_details(name)
        row_dict = row.to_dict()
        
        if details:
            row_dict['rating'] = details['rating']
            row_dict['reviews_count'] = details['user_ratings_total']
            if details['photo_url']:
                row_dict['imageUrl'] = details['photo_url']
            row_dict['lat'] = details['lat']
            row_dict['lng'] = details['lng']
            row_dict['address'] = details['address']
            print(f"   ✔️ تم إيجاد البيانات (التقييم: {details['rating']})")
        else:
            print(f"   ⚠️ لم يتم العثور على نتائج.")
            
        results.append(row_dict)
        time.sleep(1.5)

    final_df = pd.DataFrame(results)
    final_df.to_csv(output_file, index=False, encoding='utf-8-sig')
    print(f"🎉 تم الانتهاء بنجاح! الملف الجديد اتحفظ باسم: {output_file}")

if __name__ == "__main__":
    main()