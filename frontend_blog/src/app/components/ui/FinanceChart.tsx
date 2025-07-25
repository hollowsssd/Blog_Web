"use client";

import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [ 
  { 
    name: "Jan", 
    users: 100,
  }, 
  { 
    name: "Feb", 
    users: 150,
  }, 
  { 
    name: "Mar", 
    users: 500,
  }, 
  { 
    name: "Apr", 
    users: 300,
  }, 
  { 
    name: "May", 
    users: 350,
  }, 
  { 
    name: "Jun", 
    users: 420,
  }, 
  { 
    name: "Jul", 
    users: 50,
  },
  {
    name: "Aug",
    users: 580,
  },
  {
    name: "Sep",
    users: 650,
  },
  {
    name: "Oct",
    users: 720,
  },
  {
    name: "Nov",
    users: 500,
  },
  {
    name: "Dec",
    users: 800,
  }, 
]; 
 
const UserGrowthChart = () => { 
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">User Growth</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} tickMargin={20}/>
          <Tooltip />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
          />
          <Line
            type="monotone"
            dataKey="users"
            stroke="#4CAF50"
            strokeWidth={5} 
          /> 
        </LineChart>
      </ResponsiveContainer>
    </div> 
  ); 
}; 
 
export default UserGrowthChart;
