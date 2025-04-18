import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    Title,
  } from "chart.js";
import { useEffect, useState } from "react";
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    Title
  );
  import { Pie } from "react-chartjs-2";

const DashboardCharts = ({ totalLeads, leads }) => {
  const [statusLabels, setStatusLabels] = useState([]);
  const [statusCounts, setStatusCounts] = useState([]);
  const chartColors = [
    "#6366F1", "#EF4444", "#F59E0B", "#10B981", "#3B82F6",
    "#8B5CF6", "#EC4899", "#14B8A6", "#F43F5E", "#84CC16"
  ];
  useEffect(() => {
    const statusMap = {};
    leads.forEach((lead) => {
      if (lead.status) {
        statusMap[lead.status] = (statusMap[lead.status] || 0) + 1;
      }
    });

    setStatusLabels(Object.keys(statusMap));
    setStatusCounts(Object.values(statusMap));
  }, [leads]);
    const pieChartDataLeft = {
      labels: statusLabels,
  datasets: [
    {
      data: statusCounts,
      backgroundColor: statusLabels.map((_, i) => chartColors[i % chartColors.length]),
    },
  ],
    };
  
    return (
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <div className="bg-white rounded-lg shadow-[0px_2px_6px_rgba(0,0,0,0.1),0px_8px_24px_rgba(0,0,0,0.15)] w-full">
            <h4 className="text-lg text-center mt-2 font-semibold text-gray-700 mb-2">
              Répartition des leads
            </h4>
            <Pie data={pieChartDataLeft} options={{ cutout: "90%" }} />
            <p className="text-center mt-4 text-2xl font-semibold">
              Total {totalLeads}
            </p>{" "}
          </div>
        </div>
      </div>
    );
  };

export default DashboardCharts;