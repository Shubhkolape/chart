import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip, } from 'chart.js';
import CobrowseAPI from 'cobrowse-agent-sdk';
import { React, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import config from '../../../utils/config';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function MultiAgentMonthlyChart() {

     // The logic of this code is based on the agents in the api. we show the data only the agents name are available in the api, if in API there is only one agent name available then we can only show the data of that single agent. if multiple agents name in api then it automatically shows in the bar chart.
    const formatedDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        return formattedDate;
    };

    const today = new Date();
    const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 0);

    const formattedtwoMonthsAgo = formatedDate(twoMonthsAgo);
    const formattedToday = formatedDate(today);

    const [toDate, seToDate] = useState(formattedtwoMonthsAgo);
    const [fromDate, setFroDate] = useState(formattedToday);

    const [chartData, setChartData] = useState([]);


    const fetchData = async (startDate, endDate) => {
        const agentToken = config.agentToken;
        const cobrowse = new CobrowseAPI(agentToken);
        const allSessions = [];

        try {
            const sessions = await cobrowse.sessions.list({
                activated_after: startDate,
                activated_before: endDate,
                limit: 10000,
            });
            allSessions.push(...sessions);
        
        } catch (error) {
            console.error('Error fetching cobrowse data:', error);
        }
      const monthlyCounts = {};

        allSessions.forEach((session) => {
            const date = new Date(session.created);
            const monthYear = formatDate(date);
            if (!monthlyCounts[monthYear]) {
              monthlyCounts[monthYear] = 0;
            }
            monthlyCounts[monthYear]++;
          });
      
          const sortedChartData = Object.entries(monthlyCounts).map(([date, count]) => ({
            date,
            count,
          }));
          setChartData(sortedChartData);
        
    };

    useEffect(() => {
        fetchData(formattedtwoMonthsAgo, formattedToday);
    }, [formattedtwoMonthsAgo, formattedToday]);

    const handleFormSubmit = (event) => {
        event.preventDefault();
        const manualStartDate = new Date(toDate);
        const manualEndDate = new Date(fromDate);
        const formattedFromDate = formatDate(manualStartDate);
        const formattedToday = formatDate(manualEndDate);   
        fetchData(formattedFromDate, formattedToday).catch((error) =>
            console.error('Error fetching and processing data:', error),
        );
    };
  
  
    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Monthly Session Report Chart',
          },
        },
      };
      const labels = chartData.map((dataPoint) => dataPoint.date);
      const data = {
        labels,
        datasets: [
          {
            label: 'Monthly Session Count',
            data: chartData.map((dataPoint) => dataPoint.count),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1,
          },
        ],
      };

   

    return (
        <div className='main-header'>
             <h2>Monthly Session report Chart </h2>
             <div>
                <form onSubmit={handleFormSubmit} className='dailycount1'>
                    <div>
                        <label htmlFor='startDate'>From </label>
                        <input
                            type='date'
                            required
                            className='input'
                            value={toDate}
                            onChange={(e) => {
                                seToDate(e.target.value);
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor='endDate'>To </label>
                        <input
                            type='date'
                            value={fromDate}
                            required
                            className='input'
                            onChange={(e) => {
                                setFroDate(e.target.value);
                            }}
                        />
                    </div>
                    <button type='submit' className='submit-button' value='Submit'>
                        Submit
                    </button>
                </form>
            </div>
            <Bar className='daywiseCount' options={options} data={data} />
            {/* <AgentTable/> */}
        </div>
    );
}

export default MultiAgentMonthlyChart;


