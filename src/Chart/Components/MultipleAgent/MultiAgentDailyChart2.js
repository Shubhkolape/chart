import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js';
import CobrowseAPI from 'cobrowse-agent-sdk';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import agentdata from "../../../utils/licenses.json";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function MultiAgentDailyChart2() {
   
    const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        return formattedDate;
    };

    const formatedDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const today = new Date();
    const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 0);
    const formattedtwoMonthsAgo = formatedDate(twoMonthsAgo);
    const formattedToday = formatedDate(today);

    const [startDate, setStartDate] = useState(formattedtwoMonthsAgo);
    const [endDate, setEndDate] = useState(formattedToday);

    const [chartData, setChartData] = useState([]);
    // const [dateCounts, setDateCounts] = useState({});

    const fetchDataForAgents = async (startDate, endDate) => {
        const agentSessions = [];
    
        for (const agent of agentdata) {
          const cobrowse = new CobrowseAPI(agent.agent.token);
          try {
            const sessions = await cobrowse.sessions.list({
              activated_after: startDate,
              activated_before: endDate,
              limit: 10000,
            });
    
            const sessionCounts = {};
            const mainsessions = sessions.reverse()
            mainsessions.forEach((session) => {
              const date = formatDate(new Date(session.activated));
              sessionCounts[date] = (sessionCounts[date] || 0) + 1;
            });
    
            agentSessions.push({
              agentName: agent.agent.name,
              sessionCounts: sessionCounts,
            });
          } catch (error) {
            console.error(`Error fetching cobrowse data for agent :`, error);
          }
        }
        return agentSessions;
      };


    useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        const agentSessions = await fetchDataForAgents(
            formattedtwoMonthsAgo,
            formattedToday
        );
        setChartData(agentSessions);
      } catch (error) {
        console.error(
          "Error fetching and processing data for all agents:",
          error
        );
      }
    };

    fetchAndProcessData();
  }, [formattedtwoMonthsAgo, formattedToday]);

  const convertAndFormatDate = (userInputDate) => {
    const date = new Date(userInputDate);
    if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        const newDate = `${year}-${month}-${day}`;
        return newDate;
    } else {
        throw new Error('Invalid date format. Please enter a date in MM/DD/YYYY format.');
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedFromDate = convertAndFormatDate(startDate);
    const formattedToDate = convertAndFormatDate(endDate);
  const agentSessions1 =  await  fetchDataForAgents(formattedFromDate,formattedToDate);
  setChartData(agentSessions1);
   
}

const customColors = [
    'rgba(255, 99, 132, 0.5)',
    'rgba(53, 162, 235, 0.5)',
    'rgba(255, 244, 136, 0.8)'
  ];
  

  const dates =
    chartData.length > 0 ? Object.keys(chartData[0].sessionCounts) : [];


  const data = {
    labels: dates,
    datasets: chartData.map((agentData, index) => ({
      label: agentData.agentName,
      data: dates.map((date) => agentData.sessionCounts[date] || 0),
      backgroundColor: customColors[index % customColors.length], 
    })),
  };
  const options = {
    indexAxis: "x",
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Session Count by Date and Agent",
      },
      legend: {
        display: true,
        position: "top",
      },
    },
  };
    return (
        <div className='main-header'>
            <h2>Multiple Agent Daily Session Report Chart</h2>

            <div>
                <form onSubmit={handleSubmit} className='dailycount1'>
                    <div>
                        <label htmlFor='startDate'>From</label>
                        <input
                            className='input'
                            type='date'
                            id='startDate'
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor='endDate'>To </label>
                        <input
                            className='input'
                            type='date'
                            id='endDate'
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <button type='submit' className='submit-button'>
                        Submit
                    </button>
                </form>
            </div>
            <Bar className='daywiseCount' options={options} data={data} />
        </div>
    );
}

export default MultiAgentDailyChart2;
