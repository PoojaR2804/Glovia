from decimal import Decimal

from django.contrib.auth.models import User
from django.db import transaction

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    Product,
    Cart,
    CartItem,
    Wishlist,
    WishlistItem,
    Order,
    OrderItem,
)

from .serializers import (
    ProductSerializer,
    CartSerializer,
    WishlistSerializer,
    OrderSerializer,
)


# ---------------- PRODUCT APIs ----------------

class ProductListAPIView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


# ---------------- REGISTER API ----------------

class RegisterAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")
        first_name = request.data.get("first_name", "")

        if not username or not email or not password:
            return Response(
                {"error": "Username, email and password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {"username": ["This username is already taken."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {"email": ["This email is already registered."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
        )

        return Response(
            {
                "message": "Account created successfully",
                "username": user.username,
                "email": user.email,
            },
            status=status.HTTP_201_CREATED,
        )


# ---------------- CART APIs ----------------

class CartAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        return Response(CartSerializer(cart).data)


class CartItemAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get("product_id")

        try:
            quantity = int(request.data.get("quantity", 1))
        except (TypeError, ValueError):
            return Response(
                {"error": "Invalid quantity"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if quantity < 1:
            return Response(
                {"error": "Quantity must be at least 1"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            product = Product.objects.get(id=product_id)
        except (Product.DoesNotExist, ValueError, TypeError):
            return Response(
                {"error": "Product not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={"quantity": quantity},
        )

        if not created:
            item.quantity += quantity
            item.save()

        return Response(
            CartSerializer(cart).data,
            status=status.HTTP_201_CREATED,
        )

    def patch(self, request, item_id):
        try:
            item = CartItem.objects.get(
                id=item_id,
                cart__user=request.user,
            )
        except CartItem.DoesNotExist:
            return Response(
                {"error": "Cart item not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            quantity = int(request.data.get("quantity", 1))
        except (TypeError, ValueError):
            return Response(
                {"error": "Invalid quantity"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if quantity < 1:
            return Response(
                {"error": "Quantity must be at least 1"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        item.quantity = quantity
        item.save()

        return Response(CartSerializer(item.cart).data)

    def delete(self, request, item_id):
        try:
            item = CartItem.objects.get(
                id=item_id,
                cart__user=request.user,
            )
        except CartItem.DoesNotExist:
            return Response(
                {"error": "Cart item not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        cart = item.cart
        item.delete()

        return Response(CartSerializer(cart).data)


# ---------------- WISHLIST APIs ----------------

class WishlistAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        wishlist, created = Wishlist.objects.get_or_create(
            user=request.user
        )
        return Response(WishlistSerializer(wishlist).data)


class WishlistItemAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        wishlist, created = Wishlist.objects.get_or_create(
            user=request.user
        )
        product_id = request.data.get("product_id")

        try:
            product = Product.objects.get(id=product_id)
        except (Product.DoesNotExist, ValueError, TypeError):
            return Response(
                {"error": "Product not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        item, created = WishlistItem.objects.get_or_create(
            wishlist=wishlist,
            product=product,
        )

        if not created:
            return Response(
                {"error": "Product already in wishlist"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            WishlistSerializer(wishlist).data,
            status=status.HTTP_201_CREATED,
        )

    def delete(self, request, item_id):
        try:
            item = WishlistItem.objects.get(
                id=item_id,
                wishlist__user=request.user,
            )
        except WishlistItem.DoesNotExist:
            return Response(
                {"error": "Wishlist item not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        wishlist = item.wishlist
        item.delete()

        return Response(WishlistSerializer(wishlist).data)


# ---------------- PROFILE API ----------------

class ProfileAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
        })


# ---------------- CHECKOUT AND ORDERS APIs ----------------

class OrderAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    # Get the logged-in user's orders
    def get(self, request):
        orders = (
            Order.objects.filter(user=request.user)
            .prefetch_related("items")
            .order_by("-created_at")
        )

        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    # Place an order from cart or Buy Now
    def post(self, request):
        full_name = request.data.get("full_name", "").strip()
        phone = request.data.get("phone", "").strip()
        address = request.data.get("address", "").strip()

        if not full_name or not phone or not address:
            return Response(
                {"error": "Name, phone and address are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        buy_now_id = request.data.get("buy_now_product_id")
        is_buy_now = buy_now_id is not None

        try:
            with transaction.atomic():

                if is_buy_now:
                    try:
                        product = Product.objects.get(id=buy_now_id)
                        quantity = int(
                            request.data.get("buy_now_quantity", 1)
                        )
                    except (
                        Product.DoesNotExist,
                        ValueError,
                        TypeError,
                    ):
                        return Response(
                            {"error": "Invalid Buy Now product or quantity."},
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                    if quantity < 1:
                        return Response(
                            {"error": "Quantity must be at least 1."},
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                    cart_items = [(product, quantity)]

                else:
                    cart = Cart.objects.get(user=request.user)
                    items = list(
                        cart.items.select_related("product").all()
                    )

                    if not items:
                        return Response(
                            {"error": "Your cart is empty."},
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                    cart_items = [
                        (item.product, item.quantity)
                        for item in items
                    ]

                subtotal = Decimal("0.00")

                for product, quantity in cart_items:
                    if quantity > product.stock:
                        return Response(
                            {
                                "error": (
                                    f"Not enough stock for "
                                    f"{product.name}."
                                )
                            },
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                    subtotal += product.price * quantity

                # Free delivery for orders of ₹999 or more
                delivery_charge = (
                    Decimal("0.00")
                    if subtotal >= Decimal("999.00")
                    else Decimal("50.00")
                )

                total = subtotal + delivery_charge

                order = Order.objects.create(
                    user=request.user,
                    full_name=full_name,
                    phone=phone,
                    address=address,
                    total_amount=total,
                )

                for product, quantity in cart_items:
                    OrderItem.objects.create(
                        order=order,
                        product=product,
                        product_name=product.name,
                        price=product.price,
                        quantity=quantity,
                    )

                    product.stock -= quantity
                    product.save(update_fields=["stock"])

                # Clear cart only for normal cart checkout
                if not is_buy_now:
                    cart.items.all().delete()

            return Response(
                OrderSerializer(order).data,
                status=status.HTTP_201_CREATED,
            )

        except Cart.DoesNotExist:
            return Response(
                {"error": "Your cart is empty."},
                status=status.HTTP_400_BAD_REQUEST,
            )
