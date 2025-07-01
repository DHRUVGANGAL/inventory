import React, { useEffect,useContext, FC ,useState} from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Card_ from '../Components/home/Card_';
import MyScatterChart from '../Components/home/Graph';
import TopSellingTable from '../Components/home/Top_Products';
import LowStockTable from '../Components/home/Low_stock';
import RecentOrdersTable from '../Components/home/Recent_Order';



interface AuthContextType {
    isAuthenticated: boolean;
    logout: () => void;
  }
  

const Dashboard: FC = () => {



const {isAuthenticated} = useContext(AuthContext) as AuthContextType;
const navigate = useNavigate();
useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);

  

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-11 mt-5">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 items-stretch">

  <div className="h-full">
    <Card_ />
  </div>


  <div className="h-full">
    <div className="shadow p-4 bg-white rounded h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-2">Monthly Revenue</h2>
      <div className="flex-1">
        <MyScatterChart />
      </div>
    </div>
  </div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-11">
<TopSellingTable />
<LowStockTable />
  </div>
  <div className='mt-6 w-[100%]'>
  <RecentOrdersTable/>
  </div>
</div>
    
  );
}
export default Dashboard;