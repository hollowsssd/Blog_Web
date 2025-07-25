import AttendanceChart from "@/components/AttendanceChart";
import CountChart from "@/components/CountChart";
import EventCalendar from "@/components/EventCalendar";
import FinanceChart from "@/components/FinanceChart";
import Performance from "@/components/Performance";
import UserCard from "@/components/Card";


export default function Orders () {
  

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
                <h1>Orders</h1>
        
      {/* <AttendanceChart/> */}
     
      {/* <CountChart/> */}
      {/* <EventCalendar/> ***** */}

      {/* <FinanceChart/> **** */}

      {/* <Performance/> */}

      <UserCard type="User" />
      <UserCard type="Book" />
    </div>
  );
};


