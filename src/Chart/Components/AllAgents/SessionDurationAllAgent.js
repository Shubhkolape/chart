import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LineElement,
    LinearScale, PointElement,
    Title, Tooltip,
} from 'chart.js';
import CobrowseAPI from 'cobrowse-agent-sdk';
import { React, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import agentdata from '../../../utils/licenses.json';
ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend);

function SessionDurationAllAgent() {
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
    const [selectedAgent, setSelectedAgent] = useState('all');
    const [chartData, setChartData] = useState([]);

    const fetchDataForAgents = async (startDate, endDate, agentName = null) => {
        const agentSessions = [];
        const agentsToFetch = agentName
            ? [agentdata.find((agent) => agent.agent.name === agentName)]
            : agentdata;
        for (const agent of agentsToFetch) {
            const cobrowse = new CobrowseAPI(agent.agent.token);
            try {
                const sessions = await cobrowse.sessions.list({
                    activated_after: startDate,
                    activated_before: endDate,
                    limit: 10000,
                });
    
                const mainsessions  = sessions.reverse()
                const agentSessionData = mainsessions.map(session => ({
                    duration: calculateSessionDuration(session),
                    startDate: formatDate(session.activated)
                }));
                agentSessions.push({
                    agentName: agent.agent.name,
                    sessionDurations: agentSessionData, // Corrected property name to sessionDurations
                });
            } catch (error) {
                console.error(`Error fetching cobrowse data for agent:`, error);
            }
        }
        return agentSessions;
    };
    


    useEffect(() => {
        fetchDataForAgents(formattedtwoMonthsAgo, formattedToday).then(data => {
            setChartData(data);
        }).catch(error => {
            console.error('Error fetching and processing data for all agents:', error);
        });
    }, [formattedtwoMonthsAgo, formattedToday]);
    
    console.log("chartData-=-=-=-=-=-=-=-=", chartData);

    const handleAgentChange = (e) => {
        setSelectedAgent(e.target.value);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);
        setChartData(await fetchDataForAgents(formattedStartDate, formattedEndDate, selectedAgent));
    };

    const calculateSessionDuration = (session) => {
        const activatedTime = new Date(session.activated);
        const endedTime = new Date(session.ended);
        const durationInMilliseconds = endedTime - activatedTime;
        const durationInMinutes = durationInMilliseconds / (1000 * 60);
        return {
            minutes: durationInMinutes,
            formatted: formatDuration(durationInMinutes)
        };
    };

    const formatDuration = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.floor(totalMinutes % 60);
        const seconds = Math.round((totalMinutes % 1) * 60);

        let durationString = '';
        if (hours > 0) {
            durationString += `${hours} hour${hours > 1 ? 's' : ''} `;
        }
        if (minutes > 0) {
            durationString += `${minutes} minute${minutes > 1 ? 's' : ''} `;
        }
        if (seconds > 0) {
            durationString += `${seconds} second${seconds > 1 ? 's' : ''}`;
        }

        return durationString.trim();
    };

    
    const customColors = [
        'rgba(255, 99, 132, 0.5)',
        'rgba(53, 162, 235, 0.5)',
        'rgba(255, 244, 136, 0.8)'
      ];

      const bgColor = [
          'rgba(255, 244, 136, 0.8)',
          'rgba(53, 162, 235, 0.5)',
          'rgba(255, 99, 132, 0.5)',
      ];

      const labels = chartData.length > 0 && chartData[0].sessionDurations ? 
      chartData[0].sessionDurations.map((_, index) => `Session ${index + 1}`) : [];
  

  
const data = {
    labels: labels,
    datasets: chartData.map((agentData, index) => ({
        label: agentData.agentName,
        data: agentData.sessionDurations.map(session => session.duration.minutes),
        hoverText: agentData.sessionDurations.map(session => `${formatDate(session.startDate)}: ${session.duration.formatted}`),
        borderColor: customColors[index % customColors.length],
        backgroundColor: bgColor[index % customColors.length],
    })),
  };
  


    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Session Duration Report by Agent',
            },
            legend: {
                display: true,
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const hoverText = context.dataset.hoverText[context.dataIndex];
                        return hoverText;
                    }
                }
            }
        },
    };
    return (
        <div className='main-header'>
            <h2>DURATION SUMMART CHART</h2>
            <div>
                <form className='dailycount1'
                 onSubmit={handleFormSubmit}
                 >
                    <div>
                        <label htmlFor='startDate'>From </label>

                        <input
                            type='date'
                            required
                            value={startDate}
                            className="input"
                            onChange={(e) => {
                                setStartDate(e.target.value);
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor='endDate'>To </label>
                        <input
                            type='date'
                            value={endDate}
                            required
                            className="input"
                            onChange={(e) => {
                                setEndDate(e.target.value);
                            }}
                        />
                    </div>
                    <div className='agent-div'>
              <label htmlFor='agent'>Agent</label>
                <select
                   className='agent-label' 
                    id='agent'
                    value={selectedAgent}
                    onChange={handleAgentChange}
                >
                    <option value='all'>All</option>
                    {agentdata.map((agent) => (
                        <option key={agent.agent.name} value={agent.agent.name}>
                            {agent.agent.name}
                        </option>
                    ))}
                </select>
              </div>
                    <button type='submit' className='submit-button' value='Submit'>
                        Submit
                    </button>
                </form>
            </div>
        

            <Line  className="daywiseCount" data={data} options={options} />
        </div>
    );
}

export default SessionDurationAllAgent;
