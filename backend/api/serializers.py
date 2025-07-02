from rest_framework import serializers
from .models import User ,Product, Order, OrderItem, Customer
from django.db import transaction
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from drf_writable_nested.serializers import WritableNestedModelSerializer


User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'phone_number', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            phone_number=validated_data['phone_number'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password']  
        )
        return user



class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'        
    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Price cannot be negative.")
        return value



class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name')
    product_price = serializers.DecimalField(max_digits=10, decimal_places=2, source='product.price')
    # product_description = serializers.TimeField(source='product.description')
    class Meta:
        model = OrderItem
        fields = ('id','product_name', 'product_price', 'quantity', 'Item_SubTotal', )

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0.")
        return value
    

class ProductSalesSerializer(serializers.ModelSerializer):
    total_sold = serializers.IntegerField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'total_sold']




class OrderItemDetailSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name')
    product_price = serializers.DecimalField(max_digits=10, decimal_places=2, source='product.price')

    class Meta:
        model = OrderItem
        fields = ('id', 'product','product_name', 'product_price', 'quantity', 'Item_SubTotal')






class OrderInfoSerializer(serializers.ModelSerializer):
    items = OrderItemDetailSerializer(source='orderitem_set', many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['order_id', 'created_at', 'status', 'items']



class CustomerSerializer(serializers.ModelSerializer):
    OrderCount = serializers.SerializerMethodField()
    OrderDetail = OrderInfoSerializer(source='orders', many=True, read_only=True)

    class Meta:
        model = Customer
        fields = '__all__'

    def get_OrderCount(self, obj):
        return obj.orders.count()
    


# class OrderItemCreateSerializer(serializers.ModelSerializer):
#     product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), required=False)
#     # product_name = serializers.CharField(write_only=True, required=False)

#     class Meta:
#         model = OrderItem
#         fields = ('product', 'quantity', 'product_name')

    # def validate(self, data):
    #     if not data.get('product') and data.get('product_name'):
    #         try:
    #             product = Product.objects.get(name=data['product_name'])
    #             data['product'] = product
    #         except Product.DoesNotExist:
    #             raise serializers.ValidationError({'product_name': 'Invalid product name'})
    #     elif not data.get('product'):
    #         raise serializers.ValidationError({'product': 'This field is required.'})
    #     return data


# class OrderCreateSerializer(serializers.ModelSerializer):
#     customer = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all())
#     item = OrderItemCreateSerializer(many=True, required=False)  # ✅ important

#     class Meta:
#         model = Order
#         fields = (
#             'order_id',
#             'created_by',
#             'status',
#             'customer',
#             'item',
#         )
#         extra_kwargs = {
#             'user': {'read_only': True}
#         }

#     def create(self, validated_data):
#         order_items = validated_data.pop('item', [])
#         with transaction.atomic():
#             order = Order.objects.create(**validated_data)
#             for item_data in order_items:
#                 OrderItem.objects.create(order=order, **item_data)
#         return order

#     def update(self, instance, validated_data):
#         order_items = validated_data.pop('item', [])
#         with transaction.atomic():
#             instance = super().update(instance, validated_data)

#             request_method = self.context.get('request').method if self.context.get('request') else None
#             if request_method == 'PUT':
#                 instance.item.all().delete()
#                 for item_data in order_items:
#                     OrderItem.objects.create(order=instance, **item_data)

#             elif request_method == 'PATCH':
#                 existing_items = {item.id: item for item in instance.item.all()}
#                 for item_data in order_items:
#                     item_id = item_data.get('id')
#                     if item_id and item_id in existing_items:
#                         item_instance = existing_items.pop(item_id)
#                         for attr, value in item_data.items():
#                             setattr(item_instance, attr, value)
#                         item_instance.save()
#                     else:
#                         OrderItem.objects.create(order=instance, **item_data)
#         return instance

class OrderItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
       
        fields = ('id', 'product', 'quantity') 
        
        
class OrderCreateSerializer(WritableNestedModelSerializer):
   
    item = OrderItemCreateSerializer(many=True)

    class Meta:
        model = Order
        fields = (
            'order_id',
            'created_by',
            'status',
            'customer',
            'item',
        )
        read_only_fields = ('order_id', 'created_by')




# class OrderCreateSerializer(serializers.ModelSerializer):
#     customer = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all())
    
#     class OrderItemCreateSerializer(serializers.ModelSerializer):
#          product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), required=False)
        

#          class Meta:
#             model = OrderItem
#             fields = ('product', 'quantity','product_name')

#     # def validate(self, data):
#     #     if not data.get('product') and data.get('product_name'):
#     #         try:
#     #             product = Product.objects.get(name=data['product_name'])
#     #             data['product'] = product
#     #         except Product.DoesNotExist:
#     #             raise serializers.ValidationError({'product_name': 'Invalid product name'})
#     #     elif not data.get('product'):
#     #         raise serializers.ValidationError({'product': 'This field is required.'})
#     #     return data
    
   
#     def update(self, instance, validated_data):
#         orderitem_data = validated_data.pop('item', None) 
#         print("Received item payload:", orderitem_data)                   
#         with transaction.atomic():
          
       
#           instance = super().update(instance, validated_data)

#           if orderitem_data is not None:
#             request_method = self.context.get('request').method if self.context.get('request') else None
#             if request_method == 'PUT':
            
#                 instance.item.all().delete()
#                 for item_data in orderitem_data:
#                     OrderItem.objects.create(order=instance, **item_data)

#             elif request_method == 'PATCH':
#                 existing_items = {item.id: item for item in instance.item.all()}

#                 for item_data in orderitem_data:
#                     item_id = item_data.get('id', None)

#                     if item_id and item_id in existing_items:
                   
#                         item_instance = existing_items.pop(item_id)
#                         for attr, value in item_data.items():
#                             setattr(item_instance, attr, value)
#                         item_instance.save()
#                     else:
              
#                         OrderItem.objects.create(order=instance, **item_data)

#                 # Optionally delete items not in PATCH data
#                 # Uncomment below if you want to remove missing ones
#                 # for item in existing_items.values():
#                 #     item.delete()
            
#         return instance


#     def create(self, validated_data):
#         orderitem_data = validated_data.pop('item')


#         with transaction.atomic():
#              order = Order.objects.create(**validated_data)

#              for item in orderitem_data:
#                 OrderItem.objects.create(order=order, **item)

#         return order


#     class Meta:
#         model = Order
#         fields = (
#             'order_id',
#             'created_by',
#             'status',
#             'customer',
#             'item',
#         )
#         extra_kwargs = {
#             'user': {'read_only': True},
#             'created_by': {'read_only': True}
#         }





class OrderSerializer(serializers.ModelSerializer):
    order_id = serializers.UUIDField(read_only=True)
    item=OrderItemSerializer(many=True, read_only=True)
    customer = CustomerSerializer(read_only=True)
    total_price = serializers.SerializerMethodField()
    total_quantity = serializers.SerializerMethodField()
    class Meta:
        model = Order
        fields = '__all__'

    def get_total_price(self, obj):
        return sum(item.Item_SubTotal for item in obj.item.all())
    def get_total_quantity(self, obj):
        return sum(item.quantity for item in obj.item.all())
   
    
   


class ProductInfoSerializer(serializers.Serializer):
    products = ProductSerializer(many=True)
    count = serializers.IntegerField()
    max_price = serializers.FloatField()


