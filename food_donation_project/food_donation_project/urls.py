from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from accounts.views import UserViewSet, RegisterView
from donations.views import FoodCategoryViewSet, DonationViewSet, DonationClaimViewSet
from waste_tracking.views import WasteCategoryViewSet, WasteLogViewSet, WasteReductionViewSet

# Create a router and register our viewsets
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'food-categories', FoodCategoryViewSet)
router.register(r'donations', DonationViewSet, basename='donation')
router.register(r'donation-claims', DonationClaimViewSet, basename='donationclaim')
router.register(r'waste-categories', WasteCategoryViewSet)
router.register(r'waste-logs', WasteLogViewSet, basename='wastelog')
router.register(r'waste-reductions', WasteReductionViewSet, basename='wastereduction')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
