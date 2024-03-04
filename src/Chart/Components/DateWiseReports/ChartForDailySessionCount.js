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
import React, { useEffect, useMemo, useState } from "react";
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

function ChartForDailySessionCount() {
  const [dateCounts, setDateCounts] = useState({});
  const [chartData, setChartData] = useState([]);

  const today = useMemo(() => new Date(), []);
  const firstDateOfMonth = useMemo(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
    [today]
  );

  const fetchData = async (startdate, enddate) => {
    const agentToken = config.agentToken;
    const cobrowse = new CobrowseAPI(agentToken);

    try {
      const sessions = await cobrowse.sessions.list({
        activated_after: startdate,
        activated_before: enddate,
        limit: 10000,
      });
      return sessions;
    } catch (error) {
      console.error("Error fetching cobrowse data:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        const sessions = await fetchData(firstDateOfMonth, today);

        const counts = sessions.reduce((acc, item) => {
          const date = formatDate(new Date(item.created));
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        const chartDataArray = Object.entries(counts).map(([date, count]) => ({
          date,
          count,
        }));

        setDateCounts(counts);
        console.log("counts----", counts);
        setChartData(chartDataArray);
      } catch (error) {
        console.error("Error fetching and processing data:", error);
      }
    };

    fetchAndProcessData();
  }, [firstDateOfMonth, today]);

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  };
  

  const labelsDetails = chartData.map((dataPoint) => dataPoint.date);
  const dataDetails = chartData.map((dataPoint) => dataPoint.count);

  const labels = labelsDetails;
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Day Wise Session Count of Agent",
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Count",
        data: dataDetails,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  return (
    <div>
      <Line className="daywiseCount" options={options} data={data} />
    </div>
  );
}

export default ChartForDailySessionCount;
