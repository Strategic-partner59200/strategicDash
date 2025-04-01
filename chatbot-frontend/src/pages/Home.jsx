
import React, { useState, useEffect } from "react";
import DashboardCards from "../components/DashboardCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons"; // Import the calendar icon

const Home = () => {
  const [currentMonthRange, setCurrentMonthRange] = useState("");

  const getMonthRange = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear(); 

    // Current date is today
    const startDate = currentDate;
    
    // Same day next month
    const nextMonthEnd = new Date(currentYear, currentDate.getMonth() + 1, currentDate.getDate());

    const startStr = startDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const endStr = nextMonthEnd.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    return `${startStr} - ${endStr}`;
  };

  useEffect(() => {
    const updateMonthRange = () => {
      setCurrentMonthRange(getMonthRange());
    };

    updateMonthRange();

    const intervalId = setInterval(updateMonthRange, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="p-4 rounded-md bg-white">
      {/* <div className="flex items-center justify-between space-x-4">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <span className="flex items-center space-x-2 text-sm bg-gray-100 p-2 rounded-md text-gray-500">
          <FontAwesomeIcon icon={faCalendarAlt} />
          <span>{currentMonthRange}</span>
        </span>
      </div> */}
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 sm:space-x-4">
  <h2 className="text-xl sm:text-2xl font-bold text-center sm:text-left">Dashboard</h2>
  <span className="flex items-center space-x-2 text-sm bg-gray-100 p-2 rounded-md text-gray-500">
    {/* Calendar Icon */}
    <FontAwesomeIcon icon={faCalendarAlt} />
    <span>{currentMonthRange}</span>
  </span>
</div>

      <DashboardCards />
    </div>
  );
};

export default Home;

