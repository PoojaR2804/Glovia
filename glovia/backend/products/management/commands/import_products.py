import json
from pathlib import Path

from django.core.management.base import BaseCommand
from products.models import Product


class Command(BaseCommand):
    help = "Import products from products.json"

    def handle(self, *args, **kwargs):
        file_path = Path(__file__).resolve().parents[2] / "products.json"

        with open(file_path, "r", encoding="utf-8") as file:
            products = json.load(file)

        for item in products:
            Product.objects.update_or_create(
                id=item["id"],
                defaults={
                    "name": item["name"],
                    "description": item.get("description", ""),
                    "price": item["price"],
                    "category": item["category"],
                    "image": item.get("Image", ""),
                    "stock": item.get("stock", 20),
                    "rating": item.get("rating", 0),
                },
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully imported {len(products)} products!"
            )
        )