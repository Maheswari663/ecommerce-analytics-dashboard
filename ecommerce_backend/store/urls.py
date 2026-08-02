from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, ProductViewSet, CustomerViewSet,
    OrderViewSet, OrderItemViewSet, dashboard_analytics, register_view, rfm_segments, sales_prediction, login_view
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'order-items', OrderItemViewSet)


urlpatterns = router.urls+[
    path('dashboard-analytics/', dashboard_analytics, name='dashboard-analytics'),
    path('rfm-segments/', rfm_segments, name='rfm-segments'),
    path('sales-prediction/', sales_prediction, name='sales-prediction'),
    path('login/', login_view, name='login'),
    path('register/', register_view, name='register'),
]