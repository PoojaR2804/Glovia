from rest_framework import serializers

from .models import (
    Product,
    Cart,
    CartItem,
    Wishlist,
    WishlistItem,
    Order,
    OrderItem,
)


# ---------------- PRODUCT SERIALIZER ----------------

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


# ---------------- CART SERIALIZERS ----------------

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = ["id", "product", "quantity"]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "items"]


# ---------------- WISHLIST SERIALIZERS ----------------

class WishlistItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = WishlistItem
        fields = ["id", "product"]


class WishlistSerializer(serializers.ModelSerializer):
    items = WishlistItemSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = ["id", "items"]


# ---------------- ORDER SERIALIZERS ----------------

class OrderItemSerializer(serializers.ModelSerializer):
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_name",
            "product_image",
            "price",
            "quantity",
        ]

    def get_product_image(self, obj):
        if not obj.product or not obj.product.image:
            return None

        # Product.image is stored as a string
        image_url = str(obj.product.image).strip()

        if not image_url:
            return None

        # Return complete image URLs directly
        if image_url.startswith(("http://", "https://", "data:")):
            return image_url

        # Convert absolute paths into full URLs
        request = self.context.get("request")

        if request and image_url.startswith("/"):
            return request.build_absolute_uri(image_url)

        # Return the stored string for other image formats
        return image_url


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "full_name",
            "phone",
            "address",
            "total_amount",
            "status",
            "created_at",
            "items",
        ]
