import CobrowseAPI from 'cobrowse-agent-sdk';
import React, { useEffect, useState } from 'react';
import agentdata from '../../../utils/licenses.json';

function AverageDurationAllAgent() {
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
    const [selectedAgent, setSelectedAgent] = useState('all'); // State to keep track of selected agent
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

                const sessionCounts = {};
                const mainsession = sessions.reverse()
                let totalDuration = 0;

                mainsession.forEach((session) => {
                    const date = formatDate(new Date(session.activated));
                    sessionCounts[date] = (sessionCounts[date] || 0) + 1;
                    totalDuration += calculateSessionDuration(session);
                });

                agentSessions.push({
                    agentName: agent.agent.name,
                    sessionCounts: sessionCounts,
                    totalSessions: sessions.length,
                    totalDuration: totalDuration,
                    averageDuration: sessions.length > 0 ? totalDuration / sessions.length : 0,
                });
            } catch (error) {
                console.error(`Error fetching cobrowse data for agent:`, error);
            }
        }
        return agentSessions;
    };

    useEffect(() => {
        const fetchAndProcessData = async () => {
            try {
                const agentSessions = await fetchDataForAgents(
                    formattedtwoMonthsAgo,
                    formattedToday,
                );
                setChartData(agentSessions);
            } catch (error) {
                console.error('Error fetching and processing data for all agents:', error);
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

    const handleSubmitForDates = async (e) => {
        e.preventDefault();
        const formattedFromDate = convertAndFormatDate(startDate);
        const formattedToDate = convertAndFormatDate(endDate);

        fetchDataForAgents(formattedFromDate, formattedToDate, selectedAgent).then((data) => { 
            setChartData(data);
        }).catch((error) => {
            console.error('Error fetching and processing data for all agents:', error);
        });
    };

    const handleAgentChange = (e) => {
        setSelectedAgent(e.target.value); 
    };

    const calculateSessionDuration = (session) => {
        const activatedTime = new Date(session.activated);
        const endedTime = new Date(session.ended);
        const durationInMilliseconds = endedTime - activatedTime;
        const durationInMinutes = durationInMilliseconds / (1000 * 60);
        return durationInMinutes;
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

    return (
        <div className='main-header'>
            <h2>AVERAGE DURATION CHART</h2>

            <div>
                <form onSubmit={handleSubmitForDates} className='dailycount1'>
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
                        <label htmlFor='endDate'>To</label>
                        <input
                            className='input'
                            type='date'
                            id='endDate'
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <div className='agent-div'>
                        <label htmlFor='agent'>Agent</label>
                        <select
                            id='agent'
                            className='agent-label'
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
                    <button type='submit' className='submit-button'>
                        Submit
                    </button>
                </form>
            </div>

            <div className='dateTable1'>
                <h3>Session Information</h3>
                <table className='license-table'>
                    <thead>
                        <tr>
                            <th className='centered-header'>#</th>
                            <th className='centered-header'>Agent Name</th>
                            <th className='centered-header'>No. of Sessions</th>
                            <th className='centered-header'>Total Duration</th>
                            <th className='centered-header'>Average Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chartData.map((agentData, index) => (
                            <tr key={index}>
                                <td>{index + 1 }</td>
                                <td>{agentData.agentName}</td>
                                <td>{agentData.totalSessions}</td>
                                <td>{formatDuration(agentData.totalDuration)}</td>
                                <td>{formatDuration(agentData.averageDuration)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AverageDurationAllAgent;
