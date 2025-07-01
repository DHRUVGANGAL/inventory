import React,{FC,useState,useEffect} from 'react';
import { Order_This_Month,Revenue_This_Month,Active_Product } from '../../services/api';


import Card from '@mui/material/Card';



  
const Card_: FC = () => {
    const [orderCount, setOrderCount] = useState<number>(0);
    const [revenueThisMonth, setRevenueThisMonth] = useState<number>(0);
    const [activeProducts, setActiveProducts] = useState<number>(0);
    const [totalCustomers, setTotalCustomers] = useState<number>(0);

    useEffect(() => {
      const fetchOrder = async () => {
        try {
          const data = await Order_This_Month();
          setOrderCount(data.count);
        } catch (error) {
          console.error('Failed to fetch order count:', error);
        }
      };
      const fetchRevenue = async () => {
        try {
          const data = await Revenue_This_Month();
          setRevenueThisMonth(data.total_revenue);
        } catch (error) {
          console.error('Failed to fetch order count:', error);
        }
      };
      const fetch_Active_Product = async () => {
        try {
          const data = await Active_Product();
          setActiveProducts(data.count);
        } catch (error) {
          console.error('Failed to fetch order count:', error);
        }
      };

      fetch_Active_Product();
      fetchRevenue();
      fetchOrder();
    }, []);
    return(
<div className="flex flex-col items-start gap-12">
  <Card className="p-4 shadow w-64 h-full">
    <p className="text-gray-600">Orders This Month</p>
    <p className="text-2xl font-bold">{orderCount}</p>
  </Card>

  <Card className="p-4 shadow w-64 h-full">
    <p className="text-gray-600">Revenue This Month</p>
    <p className="text-2xl font-bold">${revenueThisMonth.toLocaleString()}</p>
  </Card>

  <Card className="p-4 shadow w-64 h-full">
    <p className="text-gray-600">Active Products</p>
    <p className="text-2xl font-bold">{activeProducts}</p>
  </Card>

  <Card className="p-4 shadow w-64 h-full">
    <p className="text-gray-600">Total Customers</p>
    <p className="text-2xl font-bold">{totalCustomers}</p>
  </Card>
</div>

    )
}

  
export default Card_