export interface User {
    id: string;
    email: string;
    name?: string;
  }

export interface AuthContextType {
    isAuthenticated: boolean;
  }
  

export interface OrderItemId {
    order_item_id?: number;
    product: number;
    product_name: string;
    product_price: string | number;
    quantity: number;
  }

 export interface SignUpData {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone_number: string;
  }
  
  
 export interface SignInCredentials {
    email: string;
    password: string;
  }
  
  
  export interface AuthResponse {
    access: string;
    user: User;
  }
  export interface Order_count{
    count: number;
    
  }
  export interface Order_Revenue{
    total_revenue: number;
  }
  
  export interface ActiveProduct{
    count: number;
  }
  
  
  export interface top_products{
    id: number;
    name: string;
    price: number;
    total_sold: number;
  }
  
  
  export interface Low_Stock {
    id: number;
    name: string;
    description: string; 
    price: string;        
    stock: number;
    active: boolean;
  }
  
  
  export interface PaginatedLowStockResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Low_Stock[];
  }
  export interface OrderItem {
    product_name: string;
    product_price: string; 
    quantity: number;
    Item_SubTotal: number; 
  }
  
  export interface OrderItemPayload{
    product: string;
    quantity: number;
  
  }
  
  export interface Order {
    order_id: string;
    item: OrderItem[];
    total_price: string; 
    status: string; 
    created_at: string;
    customer: Customer | null;
    created_by: number;
    product: number[]; 
    total_quantity: number;
  }
  
  
  export interface OrderListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Order[];
  }
  
  
  export interface MonthlyRevenue {
    label: string;
    value: number;
  }
  
  
  
  
  export interface OrderDetail {
    order_id: string;
    created_at: string;
    status: string;
  }
  
  export interface Customer {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    created_by: number;
    OrderCount: number;
    OrderDetail: OrderDetail[];
  }
  
  export type CreateCustomerData = Omit<Customer, 'id' | 'orderCount' | 'created_by'>;
  export type CustomerFormData = Omit<Customer, 'id' | 'orderCount' | 'created_by'>;
  
  export interface PaginatedCustomerResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Customer[];
  }
  
  
  
  export interface PaginatedOrderResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Order[];
  }
  
  export interface ProductInfo {
    id: number; 
    name: string;
    description: string;
    price: string; 
    stock: number;
    active: boolean;
  }
  
  export interface PaginatedProductResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ProductInfo[];
  }



  export interface ApiError {
    response?: {
      data?: {
        message?: string;
      };
    };
  }

  export interface SignupFormData {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string; 
    password: string;
    confirmPassword: string;
  }