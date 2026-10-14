from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token

from .views import (
    ProductListAPIView,
    ProductDetailAPIView,
    RegisterAPIView,
    CartAPIView,
    CartItemAPIView,
    WishlistAPIView,
    WishlistItemAPIView,
    ProfileAPIView,
    OrderAPIView,
)


urlpatterns = [
    # PRODUCT APIs
    path(
        "products/",
        ProductListAPIView.as_view(),
        name="product-list",
    ),
    path(
        "products/<int:pk>/",
        ProductDetailAPIView.as_view(),
        name="product-detail",
    ),

    # AUTH APIs
    path(
        "register/",
        RegisterAPIView.as_view(),
        name="register",
    ),
    path(
        "login/",
        obtain_auth_token,
        name="login",
    ),

    # CART APIs
    path(
        "cart/",
        CartAPIView.as_view(),
        name="cart",
    ),
    path(
        "cart/items/",
        CartItemAPIView.as_view(),
        name="cart-add",
    ),
    path(
        "cart/items/<int:item_id>/",
        CartItemAPIView.as_view(),
        name="cart-item",
    ),

    # WISHLIST APIs
    path(
        "wishlist/",
        WishlistAPIView.as_view(),
        name="wishlist",
    ),
    path(
        "wishlist/items/",
        WishlistItemAPIView.as_view(),
        name="wishlist-add",
    ),
    path(
        "wishlist/items/<int:item_id>/",
        WishlistItemAPIView.as_view(),
        name="wishlist-item",
    ),

    # PROFILE API
    path(
        "profile/",
        ProfileAPIView.as_view(),
        name="profile",
    ),

    # ORDERS API
    path(
        "orders/",
        OrderAPIView.as_view(),
        name="orders",
    ),
]
