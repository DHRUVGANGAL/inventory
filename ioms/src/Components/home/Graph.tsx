import { useEffect, useState } from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { fetchMonthlyRevenue } from '../../services/api'; 
import type { MonthlyRevenue } from '../../interface/interface'; 

const Graph = () => {
  const [data, setData] = useState<MonthlyRevenue[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchMonthlyRevenue();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch revenue data', error);
      }
    };

    loadData();
  }, []);

  return (
    <div style={{ display: 'flex', gap: '4rem', alignItems: 'center' }}>
      
      <div style={{ flex: 1 }}>
        <ScatterChart
          height={300}
          series={[
            {
              data: data.map((item, index) => ({
                x: index, 
                y: item.value,
                id: index,
              })),
            },
          ]}
          xAxis={[
            {
              label: 'Month',
              tickMinStep: 1,
              valueFormatter: (value: number) =>
                data[value] ? data[value].label : '',
              min: -0.5,
              max: data.length - 0.5,
              tickLabelInterval: (_, index) => index % 1 === 0,
            },
          ]}
          yAxis={[{ label: 'Revenue' }]}
        />
      </div>

     
      <div style={{ width: 400, height: 250 }}>
        <PieChart
          series={[
            {
              data: data.map((item, index) => ({
                id: index,
                value: item.value,
                label: item.label,
              })),
            },
          ]}
          width={250}
          height={250}
        />
      </div>
    </div>
  );
};

export default Graph;
