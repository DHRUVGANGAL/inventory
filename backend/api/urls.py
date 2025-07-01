from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter

urlpatterns = [
    path('products/', views.ProductListCreateAPIView.as_view()),
    # path('products/all',views.ProductListAPIView.as_view()),
    path('products/info/', views.ProductInfoAPIView.as_view()),
    path('products/<int:product_id>/', views.ProductDetailAPIView.as_view()),
    # path('orders/', views.OrderListAPIView.as_view()),
    # path('user-orders/', views.UserOrderListAPIView.as_view(), name='user-orders'),
    # path('monthly-revenue/', views.MonthlyRevenueView.as_view(), name='monthly-revenue'),
]

router = DefaultRouter()
router.register('orders', views.OrderViewSet)
router.register('users', views.UserViewSet, basename='user')
router.register('customers', views.CustomerViewSet, basename='customer')
urlpatterns += router.urls
