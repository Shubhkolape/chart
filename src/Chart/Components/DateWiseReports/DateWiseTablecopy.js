import { Icon } from '@avaya/neo-react';
import CobrowseAPI from 'cobrowse-agent-sdk';
import React, { useEffect, useState } from 'react';
import agentdata from '../../../utils/licenses.json';

function DailyChartAllAgent() {
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

    const [itemsPerPage, setItemsPerPage] = useState(5);

    const [currentPage, setCurrentPage] = useState(1);

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
                    const date = formatDate(new Date(session.activated));
                    sessionCounts[date] = (sessionCounts[date] || 0) + 1;
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
            Object.entries(agentData.sessionCounts).forEach(([date, count]) => {
                totalSessionCounts[date] = (totalSessionCounts[date] || 0) + count;
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


    const currentDateCounts = Object.entries(getChartData());
const totalPages = Math.ceil(currentDateCounts.length / itemsPerPage);

// Calculate range of data to display
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = Math.min(startIndex + itemsPerPage, currentDateCounts.length);

// Slice the data based on the current page
const currentData = currentDateCounts.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (event) => {
        const value = parseInt(event.target.value);
        setItemsPerPage(value);
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    return (
        <div className='main-header'>
            <h2>DAY SUMMARY CHART</h2>
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
                        <th className='centered-header'>#</th>
                        <th className='centered-header'>Date</th>
                        <th className='centered-header'>Count</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((dateData, index) => {
                        const date = dateData[0];
                        const count =
                            selectedAgent === 'all'
                                ? dateData[1]
                                : chartData.find(
                                      (agentData) => agentData.agentName === selectedAgent,
                                  ).sessionCounts[date];

                        const itemIndex = startIndex + index + 1;

                        return (
                            <tr key={itemIndex}>
                                <td>{itemIndex}</td>
                                <td>{count}</td>
                                <td>{date}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className='pagination'>
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
                        <Icon aria-label='backward-fast' icon='backward-fast' size='sm' />
                    </button>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <Icon aria-label='forward-fast' icon='forward-fast' size='sm' />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DailyChartAllAgent;
