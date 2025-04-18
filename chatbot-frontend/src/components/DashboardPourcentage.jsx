// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   Tooltip,
//   Legend,
//   PointElement,
//   LineElement,
//   Title,
// } from "chart.js";
// import { Bar } from "react-chartjs-2";

// import { useEffect, useState } from "react";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   Tooltip,
//   Legend,
//   PointElement,
//   LineElement,
//   Title
// );


// const DashboardPourcentage = ({ leads }) => {
//   const [statusLabels, setStatusLabels] = useState([]);
//   const [statusCounts, setStatusCounts] = useState([]);

//   useEffect(() => {
//     const statusMap = {};
//     leads.forEach((lead) => {
//       if (lead.status) {
//         statusMap[lead.status] = (statusMap[lead.status] || 0) + 1;
//       }
//     });

//     setStatusLabels(Object.keys(statusMap));
//     setStatusCounts(Object.values(statusMap));
//   }, [leads]);
 
//   const barChartData = {
//     labels: statusLabels,
//     datasets: [
//       {
//         data: statusCounts,
//         backgroundColor: "#6366F1",
//       },
//     ],
//   };

//   return (
//     <div className="">
//       <div className="flex">
//         <div style={{ height: "250px", width: "100%" }}>
//           <Bar
//             data={barChartData}
//             options={{
//               responsive: true,
//               indexAxis: "y",
//               maintainAspectRatio: false,
//               scales: {
//                 x: {
//                   beginAtZero: true,
//                   max: 100,
//                 },
//                 y: {
//                   categoryPercentage: 0.5,
//                   barPercentage: 0.8,
//                 },
//               },
//               plugins: {
//                 legend: {
//                   display: false,
//                 },
//               },
//               elements: {
//                 bar: {
//                   barThickness: 5,
//                   maxBarThickness: 5,
//                 },
//               },
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };
// export default DashboardPourcentage;
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
import { Bar } from "react-chartjs-2";
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

const DashboardPourcentage = ({ leads }) => {
  const [statusLabels, setStatusLabels] = useState([]);
  const [statusCounts, setStatusCounts] = useState([]);

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

  // Define color palette
  const chartColors = [
    "#6366F1", "#EF4444", "#F59E0B", "#10B981", "#3B82F6",
    "#8B5CF6", "#EC4899", "#14B8A6", "#F43F5E", "#84CC16"
  ];

  // Set the background colors dynamically for each status
  const barChartData = {
    labels: statusLabels,
    datasets: [
      {
        data: statusCounts,
        backgroundColor: statusLabels.map((_, i) => chartColors[i % chartColors.length]),
      },
    ],
  };

  return (
    <div className="">
      <div className="flex">
        <div style={{ height: "250px", width: "100%" }}>
          <Bar
            data={barChartData}
            options={{
              responsive: true,
              indexAxis: "y", // Horizontal bar chart
              maintainAspectRatio: false,
              scales: {
                x: {
                  beginAtZero: true,
                  max: 100,
                },
                y: {
                  categoryPercentage: 0.5,
                  barPercentage: 0.8,
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
              },
              elements: {
                bar: {
                  barThickness: 5,
                  maxBarThickness: 5,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPourcentage;
