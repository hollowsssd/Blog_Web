"use client";
import FinanceChart from "@/app/components/ui/FinanceChart";


const AdminPage = () => {
  return (

    <div className="p-4 flex gap-4 flex-col md:flex-row">
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>
      {/* RIGHT */}
    </div>
  );
};

export default AdminPage;
