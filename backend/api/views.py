from django.db.models import Max
from django.utils.decorators import method_decorator
# from django.views.decorators.cache import cache_page
from api.serializers import ProductSerializer, OrderSerializer, ProductInfoSerializer, OrderCreateSerializer,ProductSalesSerializer,CustomerSerializer
from api.models import Product, Order, OrderItem,Customer
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import generics ,viewsets
from django.views.decorators.vary import vary_on_headers
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.permissions import (
    IsAuthenticated,
    IsAdminUser,
    AllowAny
)
from django.db.models import F, Sum, DecimalField, ExpressionWrapper
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from api.filter import ProductFilter,InStockFilterBackend, OrderFilter
from rest_framework.pagination import PageNumberPagination, LimitOffsetPagination
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from rest_framework.response import Response
from django.db.models.functions import TruncMonth
from django.utils.dateformat import DateFormat

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action in ['create']:
            return [AllowAny()]
        return super().get_permissions()
    

# class MonthlyRevenueView(APIView):
    

#     def get(self, request):
    
#         filtered_orders = OrderFilter(request.GET, queryset=Order.objects.all()).qs

       
#         revenue = OrderItem.objects.filter(order__in=filtered_orders).aggregate(
#             revenue=Sum(
#                 ExpressionWrapper(
#                     F('product__price') * F('quantity'),
#                     output_field=DecimalField()
#                 )
#             )
#         )['revenue'] or 0

#         return Response({'total_revenue': revenue})
    


class ProductListCreateAPIView(generics.ListCreateAPIView):
    queryset = Product.objects.order_by('pk')
    serializer_class = ProductSerializer
    filterset_class = ProductFilter
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
        # InStockFilterBackend
    ]
    search_fields = ['id', 'name']
    ordering_fields = ['name', 'price', 'stock']
    pagination_class = PageNumberPagination
    # pagination_class.page_size = 2
    # pagination_class.page_query_param = 'pagenum'
    # pagination_class.page_size_query_param = 'size'
    # pagination_class.max_page_size = 4

    # @method_decorator(cache_page(60 * 15, key_prefix='product_list'))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    # def get_queryset(self):
    #     import time
    #     time.sleep(2)
    #     return super().get_queryset()    
        

    def get_permissions(self):
        self.permission_classes = [AllowAny]
        if self.request.method == 'POST':
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()


class ProductDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_url_kwarg = 'product_id'

    def get_permissions(self):
        self.permission_classes = [AllowAny]
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()    
    





class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.prefetch_related('item__product')
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]
    pagination_class = LimitOffsetPagination
    filterset_class = OrderFilter
    filter_backends = [DjangoFilterBackend]
    lookup_field = 'order_id'

    # @method_decorator(cache_page(60 * 1, key_prefix='order_list'))
    # @method_decorator(vary_on_headers("Authorization"))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    # def update(self, request, *args, **kwargs):
    #     partial = kwargs.pop('partial', False)
    #     instance = self.get_object()
    #     serializer = self.get_serializer(instance, data=request.data, partial=partial)
    
    #     if not serializer.is_valid():
    #         print("Serializer errors:", serializer.errors)  
    #         return Response(serializer.errors, status=400)  
    
    #     self.perform_update(serializer)
    #     return Response(serializer.data)    

    def get_serializer_class(self):
        if self.action in ['update', 'create','partial_update']:
            return OrderCreateSerializer
        return super().get_serializer_class()

    @action(detail=False, methods=['get'], url_path='month-revenue')
    def month_revenue(self, request):
        
        filtered_orders = OrderFilter(request.GET, queryset=self.get_queryset()).qs

        revenue = OrderItem.objects.filter(order__in=filtered_orders).aggregate(
            revenue=Sum(
                ExpressionWrapper(
                    F('product__price') * F('quantity'),
                    output_field=DecimalField()
                )
            )
        )['revenue'] or 0

        return Response({'total_revenue': revenue})
    @action(detail=False, methods=['get'], url_path='top-selling')
    def top_selling(self, request):
        top_products = (
            Product.objects
            .annotate(total_sold=Sum('orderitem__quantity'))
            .order_by('-total_sold')[:5]
        )
        serializer = ProductSalesSerializer(top_products, many=True)
        return Response(serializer.data)
       
    @action(detail=False, methods=['get'], url_path='monthly-revenue')
    def monthly_revenue(self, request):
      
        revenue_qs = (
            Order.objects
            .annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(
                total_revenue=Sum(
                    ExpressionWrapper(
                        F('item__product__price') * F('item__quantity'),
                        output_field=DecimalField()
                    )
                )
            )
            .order_by('month')
        )

        result = [
            {
                'label': DateFormat(entry['month']).format('M Y'),
                'value': entry['total_revenue'] or 0
            }
            for entry in revenue_qs
        ]

        return Response(result)
    

    # def get_queryset(self):
    #     qs = super().get_queryset()
    #     if not self.request.user.is_staff:
    #         qs = qs.filter(user=self.request.user)
    #     return qs 
    
 
class ProductInfoAPIView(APIView):
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductInfoSerializer({
            'products': products,
            'count': len(products),
            'max_price': products.aggregate(max_price=Max('price'))['max_price']
        })
        return Response(serializer.data)
    
# from django.contrib.auth.models import AnonymousUser
class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [AllowAny]
    search_fields = ['id', 'name']
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
    ]

    # def perform_create(self, serializer):
    #     user = self.request.user
    #     if isinstance(user, AnonymousUser):
    #         serializer.save()  
    #     else:
    #         serializer.save(created_by=user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)