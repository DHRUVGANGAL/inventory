from django.contrib import admin
from .models import Order, OrderItem,User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

class UserAdmin(BaseUserAdmin):
    model = User
    list_display = ('email', 'first_name', 'last_name', 'phone_number', 'is_staff')
    list_filter = ('is_staff', 'is_superuser')
    ordering = ('email',)
    search_fields = ('email', 'first_name', 'last_name', 'phone_number')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'phone_number')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'phone_number', 'first_name', 'last_name', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )



class OrderInlines(admin.TabularInline):
    model = OrderItem

class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderInlines]  

admin.site.register(Order, OrderAdmin)
admin.site.register(User, UserAdmin)

