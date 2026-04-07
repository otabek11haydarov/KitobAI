import csv
import json
import random
import urllib.parse
from datetime import datetime, timedelta

def get_random_date(start_year=2022, end_year=2025):
    start = datetime(start_year, 1, 1)
    end = datetime(end_year, 12, 31)
    return start + timedelta(seconds=random.randint(0, int((end - start).total_seconds())))

def run():
    books = []
    with open('out.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            books.append(row)

    stores = ["Asaxiy", "Amazon", "ZoodMall", "Ozon"]

    marketplace = []
    users = []
    orders = []
    cart_examples = []
    
    # 1. Users
    for i in range(1, 11):
        users.append({
            "id": f"usr_{i}",
            "name": f"User {i}",
            "email": f"user{i}@example.com",
            "password": f"$2a$12$eImiTXuWVxfM37uY4JANjQ==_{i}",
            "created_at": get_random_date().isoformat() + "Z"
        })
        
    # 2. Marketplace Listings
    listing_id_counter = 1
    for book in books:
        book_title = book['title']
        book_author = book['author']
        
        num_listings = random.randint(2, 4)
        book_listings = []
        selected_stores = random.sample(stores, num_listings)
        
        for store in selected_stores:
            if store == "Amazon":
                price = round(random.uniform(9.99, 29.99), 2)
                currency = "USD"
            else:
                price = random.randint(50000, 200000)
                currency = "UZS"
                
            enc_title = urllib.parse.quote_plus(book_title.lower())
            domain = {
                "Asaxiy": "asaxiy.uz",
                "Amazon": "amazon.com",
                "ZoodMall": "zoodmall.uz",
                "Ozon": "ozon.ru"
            }[store]
            
            listing = {
                "id": f"list_{listing_id_counter}",
                "title": book_title,
                "author": book_author,
                "store_name": store,
                "price": price,
                "currency": currency,
                "product_url": f"https://www.{domain}/product/{enc_title}",
                "image_url": book['image_url'],
                "in_stock": random.choice([True, True, True, False]),
                "rating": round(random.uniform(3.5, 5.0), 1),
                "reviews_count": random.randint(0, 500),
                "add_to_cart_enabled": True,
                "buy_now_enabled": True,
                "wishlist_enabled": True
            }
            book_listings.append(listing)
            listing_id_counter += 1
            
        # Sort by price (Convert USD to UZS roughly for sorting, 1 USD = 12500 UZS)
        def get_uzs_price(item):
            return item['price'] * 12500 if item['currency'] == 'USD' else item['price']
            
        book_listings.sort(key=get_uzs_price)
        marketplace.extend(book_listings)

    # Orders and Cart Examples
    order_id_counter = 1
    cart_id_counter = 1
    for user in users:
        # Generate 1-3 orders per user
        for _ in range(random.randint(1, 3)):
            num_items = random.randint(1, 3)
            order_items = random.sample(marketplace, num_items)
            
            # Simple currency handling - if mixed, convert to UZS
            total = 0
            order_item_details = []
            for item in order_items:
                p = item['price'] * 12500 if item['currency'] == 'USD' else item['price']
                total += p
                order_item_details.append({
                    "title": item['title'],
                    "price": round(p, 2)
                })
                
            orders.append({
                "order_id": f"ord_{order_id_counter}",
                "user_id": user['id'],
                "items": order_item_details,
                "total_amount": round(total, 2),
                "currency": "UZS",
                "payment_method": random.choice(["card", "payme", "click", "cash"]),
                "status": random.choice(["pending", "paid", "cancelled"]),
                "purchased_at": get_random_date().isoformat() + "Z"
            })
            order_id_counter += 1
            
        # 1 cart example per user
        cart_items = random.sample(marketplace, random.randint(1, 3))
        total_cart = 0
        cart_item_refs = []
        for item in cart_items:
            q = random.randint(1, 2)
            p = item['price'] * 12500 if item['currency'] == 'USD' else item['price']
            total_cart += p * q
            cart_item_refs.append({
                "listing_id": item['id'],
                "quantity": q
            })
            
        cart_examples.append({
            "cart_id": f"cart_{cart_id_counter}",
            "user_id": user['id'],
            "items": cart_item_refs,
            "total_price": round(total_cart, 2),
            "currency": "UZS",
            "payment_method": random.choice(["card", "payme", "click", "cash"]),
            "status": random.choice(["pending", "paid", "cancelled"]),
            "created_at": get_random_date().isoformat() + "Z"
        })
        cart_id_counter += 1

    final_data = {
        "books": books,
        "marketplace": marketplace,
        "users": users,
        "orders": orders,
        "cart_examples": cart_examples
    }
    
    with open('marketplace.json', 'w', encoding='utf-8') as f:
        json.dump(final_data, f, ensure_ascii=False, indent=2)

run()
