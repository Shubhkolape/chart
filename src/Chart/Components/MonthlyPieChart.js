import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import CobrowseAPI from "cobrowse-agent-sdk";
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import config from "../../utils/config";

ChartJS.register(ArcElement, Tooltip, Legend);

function MonthlyPieChart() {

    
    const [monthlyCounts, setMonthlyCounts] = useState({});

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
        const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 90, 0);
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

      
      const keys = Object.keys(monthlyCounts)
      const values = Object.values(monthlyCounts)

      const labels = keys.map(key => {
        const [month, year] = key.split('-');
        return `${month}/${year}`;
    });
    
         const data = {
        labels:labels,
        datasets: [
          {
            label: 'No of Sessions ',
            data: values,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };


  return (
    <div className='Piechart1'>
      <h1>Monthly Sessions handled by Agent </h1>
    <div className='pie1'>
            <Pie data={data} />
    </div>
    </div>
  )
}

export default MonthlyPieChart