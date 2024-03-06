import CobrowseAPI from 'cobrowse-agent-sdk';
import React, { useEffect, useState } from 'react';
import agentdata from '../../../utils/licenses.json';

function MonthlyTableAllAgent() {
    const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const formattedDate = `${year}-${month}`;
        return formattedDate;
    };

    const formatedDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const today = new Date();
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, 1);
    const formattedSixMonthsAgo = formatedDate(sixMonthsAgo);
    const formattedToday = formatedDate(today);

    const [startDate, setStartDate] = useState(formattedSixMonthsAgo);
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

                const sessionCounts = {};
                const mainsessions = sessions.reverse();
                mainsessions.forEach((session) => {
                    const monthYear = formatDate(new Date(session.activated));
                    sessionCounts[monthYear] = (sessionCounts[monthYear] || 0) + 1;
                });

                agentSessions.push({
                    agentName: agent.agent.name,
                    sessionCounts: sessionCounts,
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
                    formattedSixMonthsAgo,
                    formattedToday,
                );
                setChartData(agentSessions);
            } catch (error) {
                console.error('Error fetching and processing data for all agents:', error);
            }
        };

        fetchAndProcessData();
    }, [formattedSixMonthsAgo, formattedToday]);

    const convertAndFormatDate = (userInputDate) => {
        const date = new Date(userInputDate);
        if (!isNaN(date.getTime())) {
            const year = date.getFullYear();
            const month = `0${date.getMonth() + 1}`.slice(-2);
            const newDate = `${year}-${month}`;
            return newDate;
        } else {
            throw new Error('Invalid date format. Please enter a date in MM/YYYY format.');
        }
    };

    const handleSubmitForDates = async (e) => {
        e.preventDefault();
        const formattedFromDate = convertAndFormatDate(startDate);
        const formattedToDate = convertAndFormatDate(endDate);

        if (selectedAgent === 'all') {
            const agentSessions1 = await fetchDataForAgents(formattedFromDate, formattedToDate);
            setChartData(agentSessions1);
        } else {
            const agentSessions1 = await fetchDataForAgents(
                formattedFromDate,
                formattedToDate,
                selectedAgent,
            );
            setChartData(agentSessions1); // Update chartData with data for selected agent
        }
    };

    const handleAgentChange = (e) => {
        setSelectedAgent(e.target.value); // Update selectedAgent state
    };

    const getChartData = () => {
        const totalSessionCounts = {};
        chartData.forEach((agentData) => {
            Object.entries(agentData.sessionCounts).forEach(([monthYear, count]) => {
                totalSessionCounts[monthYear] = (totalSessionCounts[monthYear] || 0) + count;
            });
        });

        if (selectedAgent === 'all') {
            return totalSessionCounts;
        } else {
            const selectedAgentData = chartData.find(
                (agentData) => agentData.agentName === selectedAgent,
            );
            return selectedAgentData ? selectedAgentData.sessionCounts : {};
        }
    };
    const months = Object.keys(getChartData());

    // const currentDateCounts = Object.entries(getChartData());
    // const totalPages = Math.ceil(currentDateCounts.length / itemsPerPage);
    
    // // Calculate range of data to display
    // const startIndex = (currentPage - 1) * itemsPerPage;
    // const endIndex = Math.min(startIndex + itemsPerPage, currentDateCounts.length);
    
    // // Slice the data based on the current page
    // const currentData = currentDateCounts.slice(startIndex, endIndex);
    
    // const handlePageChange = (page) => {
    //     setCurrentPage(page);
    // };
    
    // const handleItemsPerPageChange = (event) => {
    //     const value = parseInt(event.target.value);
    //     setItemsPerPage(value);
    //     setCurrentPage(1); // Reset to first page when changing items per page
    // };

        

    return (
        <div className='main-header'>
            <h2>MONTHLY SUMMARY TABLE</h2>

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
                    <div>
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
                    </div>
                    <button type='submit' className='submit-button'>
                        Submit
                    </button>
                </form>
            </div>

            <table className='license-table'>
                <thead>
                    <tr>
                        <th className='centered-header'>Agent</th>
                        {months.map((month) => (
                            <th className='centered-header' key={month}>{month}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {chartData.map((agentData) => (
                        <tr key={agentData.agentName}>
                            <td>{agentData.agentName}</td>
                            {months.map((month) => (
                                <td key={month}>{agentData.sessionCounts[month] || 0}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* <div className='pagination'>
        <div>
            Rows per page:{' '}
            <select
                className='select'
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
            >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
            </select>
        </div>

        <div className='pagination-button'>
            <span>
                {currentPage} of {totalPages}
            </span>
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Previous
            </button>

            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    </div> */}
        </div>
    );
}

export default MonthlyTableAllAgent;
