import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import CobrowseAPI from 'cobrowse-agent-sdk';
import { React, useEffect, useState } from 'react';
import agentdata from "../../../utils/licenses.json";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function MultiAgentMonthTable() {


  const formatedDate = (date) => {
    return date.toISOString().split('T')[0];
};


const today = new Date();
const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 0);

const formattedtwoMonthsAgo = formatedDate(twoMonthsAgo);
const formattedToday = formatedDate(today);
const [chartData, setChartData] = useState([]);;

const [fromDate, setFroDate] = useState(formattedtwoMonthsAgo);
const [toDate, seToDate] = useState(formattedToday);

const formatDate = (inputDate) => {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
};

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
        const month = date.slice(0, 7); 
        sessionCounts[month] = (sessionCounts[month] || 0) + 1; 
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


const handleFormSubmit = async  (event) => {
  event.preventDefault();
  const formattedFromDate = formatDate(fromDate);
  const formattedToday = formatDate(toDate);
  const agentSessions1 =  await  fetchDataForAgents(formattedFromDate,formattedToday);
  setChartData(agentSessions1);
  //   setPage(1);
};

const months =
chartData.length > 0 ? Object.keys(chartData[0].sessionCounts) : [];


  return (
    <div  className='license-info'>
      <h2>AGENT SESSIONS DETAILS TABLE</h2>
      <div>
                <form onSubmit={handleFormSubmit} className='dailycount1'>
                    <div>
                        <label htmlFor='startDate'>From </label>
                        <input
                            type='date'
                            required
                            className='input'
                            value={fromDate}
                            onChange={(e) => {
                              setFroDate(e.target.value);
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor='endDate'>To </label>
                        <input
                            type='date'
                            className='input'
                            value={toDate}
                            required
                            onChange={(e) => {
                                seToDate(e.target.value);
                            }}
                        />
                    </div>
                    <button type='submit' className='submit-button' value='Submit'>
                        Submit
                    </button>
                </form>
            </div>
       <table className='license-table-agent'>
        <thead>
          <tr>
            <th className="centered-header" >#</th>
            <th className="centered-header" >Agent Name</th>
            {months.map((month) => (
              <th  className='centered-header'  key={month}>{month}</th>
            ))}
          </tr>
        </thead>
        <tbody>
        {chartData.map((agentData, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{agentData.agentName}</td>
              {months.map((month) => (  
                <td key={`${agentData.agentName}-${month}`}>
                  {agentData.sessionCounts[month] || 0}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MultiAgentMonthTable