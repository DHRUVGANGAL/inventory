import axios from 'axios';

import type{ AxiosError, InternalAxiosRequestConfig } from 'axios';

import { API_URL } from '../config';



interface User {
  id: string;
  email: string;
  name?: string;
}

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   description?: string;
// }


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

export interface Active_Product{
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


interface PaginatedLowStockResponse {
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
  OrderDetail: any[];
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


const api = axios.create({
  baseURL: API_URL,
});









api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      
      config.headers.Authorization = `Bearer ${token}`;
      
      
    }
    return config;
  },
  (error: AxiosError) => {
    
    return Promise.reject(error);
  }
);


export const signUp = async (userData: SignUpData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/users/', userData);
  return response.data;
};

export const signIn = async (credentials: SignInCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/token/', credentials);
  return response.data;
};

export const Order_This_Month = async (): Promise<Order_count> => {
  const currentMonth = new Date().getMonth() + 1; 
  const response = await api.get<Order_count>(`/orders/?month=${currentMonth}`);
  return response.data;
};

export const Revenue_This_Month = async (): Promise<Order_Revenue> => {
  const currentMonth = new Date().getMonth() + 1; 
  const response = await api.get<Order_Revenue>(`/orders/month-revenue/?month=${currentMonth}`);
  return response.data;
};
export const Active_Product = async (): Promise<Active_Product> => {
  const response = await api.get<Active_Product>('/products/?active=true');
  return response.data;
};

export const Top_Products = async (): Promise<top_products[]> => {
  const response = await api.get<top_products[]>('/orders/top-selling/');
  return response.data;
};

export const fetchLowStock = async (): Promise<Low_Stock[]> => {
  const response = await api.get<PaginatedLowStockResponse>('/products/?stock__lt=5');
  return response.data.results;
};

export const fetchRecentOrders = async (): Promise<Order[]> => {
  const response = await api.get<OrderListResponse>('/orders/?recent=true');
  return response.data.results;
};

export const fetchMonthlyRevenue = async (): Promise<MonthlyRevenue[]> => {
  const response = await api.get<MonthlyRevenue[]>('/orders/monthly-revenue/');
  return response.data;
};


export const fetchCustomers = async (): Promise<Customer[]> => {
  const response = await api.get<PaginatedCustomerResponse>('/customers/');
  return response.data.results;
};

export const createCustomer = async (customerData: CreateCustomerData): Promise<Customer> => {
  const response = await api.post<Customer>('/customers/', customerData);
  return response.data;
};

export const updateCustomer = async (id: number, customerData: Partial<CustomerFormData>): Promise<Customer> => {
  const response = await api.patch<Customer>(`/customers/${id}/`, customerData);
  return response.data;
}

export const deleteCustomer = async (id: number): Promise<void> => {
  await api.delete(`/customers/${id}/`);
  
}

export const fetchCustomerDetails = async (id: number): Promise<Customer> => {
  const response = await api.get<Customer>(`/customers/${id}/`);
  return response.data;
}



export const fetchPaginatedOrders = async (page: number = 1): Promise<PaginatedOrderResponse> => {
    const response = await api.get<PaginatedOrderResponse>(`/orders?page=${page}`);
    return response.data;
 }

 export const fetchOrderDeatil = async (id: string): Promise<Order> => {
  const response = await api.get<Order>(`/orders/${id}/`);
  return response.data;
};
export const createOrder = async (orderData: any): Promise<Order> => {
  const response = await api.post<Order>('/orders/', orderData);
  return response.data;
};

export const updateOrder = async (id: string, orderData: any): Promise<Order> => {
  console.log(orderData)
  const response = await api.patch<Order>(`/orders/${id}/`, orderData);
  return response.data;
};

export const deleteOrder = async (id: string): Promise<void> => {
  await api.delete(`/orders/${id}/`);
};

export const fetchCustomer = async (search: string = ''): Promise<Customer[]> => {
  
  const response = await api.get<PaginatedCustomerResponse>(`/customers/?search=${search}`);
  return response.data.results;
};


export const fetchProducts = async (search: string = ''): Promise<ProductInfo[]> => {
  const response = await api.get<PaginatedProductResponse>(`/products/?search=${search}`);
  return response.data.results; 

};



export const fetchProduct = async (page: number = 1): Promise<PaginatedProductResponse> => {
  const response = await api.get<PaginatedProductResponse>(`/products/?page=${page}`);
  return response.data;
}


export const fetchProductDetails = async (id: number): Promise<ProductInfo> => {
  const response = await api.get<ProductInfo>(`/products/${id}/`);
  return response.data;
}

export const createProduct = async (productData: Omit<ProductInfo, 'id'>): Promise<ProductInfo> => {
  const response = await api.post<ProductInfo>('/products/', productData);
  return response.data;
};

export const updateProduct = async (id: number, productData: Partial<ProductInfo>): Promise<ProductInfo> => {
  const response = await api.patch<ProductInfo>(`/products/${id}/`, productData);
  return response.data;
}


export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/products/${id}/`);

}


export default api;