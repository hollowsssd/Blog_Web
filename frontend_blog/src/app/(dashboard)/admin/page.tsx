"use client";
import FinanceChart from "@/app/components/ui/FinanceChart";
// import EventCalendar from "@/app/components/ui/EventCalendar";


const AdminPage = () => {
  return (

    <div className="p-4 flex gap-4 flex-col md:flex-row">
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* CARDS */}
       
        {/* MIDDLE CHARTS */}
      
        {/* BOTTOM CHART */}
       <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        {/* <EventCalendar /> */}
      </div>
      </div>
    
  );
};

export default AdminPage;
