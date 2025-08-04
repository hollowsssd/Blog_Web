"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Cookies from "universal-cookie";

const UserGrowthChart = () => {
  const [data, setData] = useState<{ name: string; users: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cookies = new Cookies();
        const token = cookies.get("token");

        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/api/user/chart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

        // console.log("data", res.data);
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-xl w-full h-[400px] p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">User Growth</h1>
        <Image src="/images/moreDark.png" alt="" width={20} height={20} />
      </div>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
            tickMargin={20}
          />
          <Tooltip />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
          />
          <Line type="monotone" dataKey="users" stroke="#4CAF50" strokeWidth={5} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserGrowthChart;
