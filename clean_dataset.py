import json
import os

def clean_dataset(filename):
    if not os.path.exists(filename):
        print(f"File {filename} not found.")
        return

    blacklist = [
        'тетрадь', 'пропись', 'daftar', 'xatchop', 'bookmark', 'закладка',
        'прописи', 'ручка', 'карандаш', 'qalam', 'ruchka', 'блокнот', 'офис',
        'канцелярия', 'пайнет', 'paynet', 'sumka', 'рюкзак', 'shaxmat', 'shashka',
        'o\'yin', 'игрушка', 'pazl', 'puzzle', 'kubik', 'magnit', 'sovg\'a', 'podarok',
        'kartochka', 'stiker', 'sticker', 'liner', 'marker', 'albom', 'skotch', 'yelim'
    ]

    with open(filename, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
        except Exception as e:
            print(f"Error loading {filename}: {e}")
            return

    initial_count = len(data)
    cleaned_data = []

    for item in data:
        title = item.get('title', '').lower()
        if not any(word in title for word in blacklist):
            cleaned_data.append(item)

    removed = initial_count - len(cleaned_data)
    print(f"Cleaned {filename}: Removed {removed} non-book items. Remaining: {len(cleaned_data)}")

    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(cleaned_data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    clean_dataset('asaxiy_full_books.json')
    # Add other files if needed
