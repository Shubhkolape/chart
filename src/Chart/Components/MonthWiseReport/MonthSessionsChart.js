import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import CobrowseAPI from "cobrowse-agent-sdk";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import config from "../../../utils/config";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function MonthSessionsChart() {

  const [monthlyCounts, setMonthlyCounts] = useState({});

  const [toDate, seToDate] = useState("");
  const [fromDate, setFroDate] = useState("");

  const fetchData = async (startDate, endDate) => {
    const agentToken = config.agentToken;
    const cobrowse = new CobrowseAPI(agentToken);

    try {
      const sessions = await cobrowse.sessions.list({
        activated_after: startDate,
        activated_before: endDate,
        limit: 10000,
      });
      const monthly = {};
      sessions.forEach((item) => {
        const date = new Date(item.created);
        const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
        monthly[monthYear] = (monthly[monthYear] || 0) + 1;
      });
      const sortedMonthly = Object.fromEntries(
        Object.entries(monthly).sort(([a], [b]) => {
          const [aMonth, aYear] = a.split('-');
          const [bMonth, bYear] = b.split('-');
          return bYear - aYear || bMonth - aMonth;
        })
      );
      console.log("sortedMonthly----", sortedMonthly);
      setMonthlyCounts(sortedMonthly);
      // setAPIdata(sessions);    
      console.log("sessions ----", sessions);
    } catch (error) {
      console.error("Error fetching cobrowse data:", error);
    }
  };

  useEffect(() => {
    const today = new Date();
    const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 0);
    const formattedTwoMonthsAgo = formatDate(twoMonthsAgo);
    const formattedToday = formatDate(today);
    fetchData(formattedTwoMonthsAgo, formattedToday);
  }, []);

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
  
    return formattedDate;
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const manualStartDate = new Date(toDate);
    const manualEndDate = new Date(fromDate);
    const formattedFromDate = formatDate(manualStartDate);
    const formattedToday = formatDate(manualEndDate);
      fetchData(formattedFromDate, formattedToday)
      .catch(error => console.error("Error fetching and processing data:", error));
    //   setPage(1);
   
  };

  const keys = Object.keys(monthlyCounts);
  const values = Object.values(monthlyCounts);

  const labels = keys.map((key) => {
    const [month, year] = key.split("-");
    return `${month}/${year}`;
  });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Sessions handled by Agent",
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Monthly Sessions handled by Agent",
        data: values,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <div>
        <div>
        <form onSubmit={handleFormSubmit}>
        <div className="user-details">
          <div className="input-box">
            <span className="details">From</span>
            <input
              type="date"
              required
              value={toDate}
              onChange={(e) => {
                seToDate(e.target.value);
              }}
            />
          </div>
          <div className="input-box">
            <span className="details">To</span>
            <input
              type="date"
              value={fromDate}
              required
              onChange={(e) => {
                setFroDate(e.target.value);
              }}
            />
          </div>
          <div className="button">
            <input type="submit" value="Submit" />
          </div>
        </div>
      </form>
        </div>
      <Line className="daywiseCount" options={options} data={data} />
      {console.log("values---", values)}
    </div>
  );
}

export default MonthSessionsChart;
