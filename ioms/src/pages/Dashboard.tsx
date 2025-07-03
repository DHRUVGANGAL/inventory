import type{ FC } from 'react';
import DashBoardCard from '../Components/home/DashBoardCard';
import Graph from '../Components/home/Graph';
import TopSelling from '../Components/home/TopProducts';
import LowStock from '../Components/home/LowStock';
import RecentOrders from '../Components/home/RecentOrder';





const Dashboard: FC = () => {





  

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-11 mt-5">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 items-stretch">

  <div className="h-full">
    <DashBoardCard />
  </div>


  <div className="h-full">
    <div className="shadow p-4 bg-white rounded h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-2">Monthly Revenue</h2>
      <div className="flex-1">
        <Graph/>
      </div>
    </div>
  </div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-11">
<TopSelling />
<LowStock />
  </div>
  <div className='mt-6 w-[100%]'>
  <RecentOrders/>
  </div>
</div>
    
  );
}
export default Dashboard;