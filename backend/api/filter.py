import django_filters
from api.models import Product, Order
from rest_framework import filters
from django.utils import timezone
from datetime import timedelta


class InStockFilterBackend(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        return queryset.filter(stock__gt=0)


class ProductFilter(django_filters.FilterSet):
    class Meta:
        model = Product
        fields = {
            'name': ['iexact', 'icontains'], 
            'price': ['exact', 'lt', 'gt', 'range'],
            'active': ['exact'],
            'stock': ['exact', 'lt', 'gt', 'range'],
        }

class OrderFilter(django_filters.FilterSet):
    created_at = django_filters.DateFilter(field_name='created_at__date')
    month = django_filters.NumberFilter(field_name='created_at', lookup_expr='month')
    recent = django_filters.BooleanFilter(method='filter_recent')

    class Meta:
        model = Order
        fields = {
            'status': ['exact'],
            'created_at': ['lt', 'gt', 'exact'],
        }

    def filter_recent(self, queryset, name, value):
        if value:
            last_7_days = timezone.now() - timedelta(days=10)
            return queryset.filter(created_at__gte=last_7_days)
        return queryset
