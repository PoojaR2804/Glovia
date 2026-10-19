import json
import requests

API_URL = "https://glovia-backend-8zxd.onrender.com/api/products/"

with open("backend/products/products.json", "r", encoding="utf-8") as file:
    products = json.load(file)

for product in products:
    data = {
        "name": product["name"],
        "description": product.get(
            "description",
            f"Discover our {product['name']}."
        ),
        "price": str(product["price"]),
        "category": product["category"],
        "image": product.get("image") or product.get("Image", ""),
        "stock": 10,
        "rating": str(product["rating"]),
    }

    response = requests.post(API_URL, json=data, timeout=60)

    if response.status_code == 201:
        print(f"Added: {data['name']}")
    else:
        print(f"Failed: {data['name']}")
        print(response.status_code, response.text)

print("Upload finished!")