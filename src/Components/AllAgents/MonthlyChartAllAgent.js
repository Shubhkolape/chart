import { Spinner } from '@avaya/neo-react';
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
import html2pdf from 'html2pdf.js';
import React, { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import agentdata from '../../utils/licenses.json';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function MonthlyChartAllAgent() {
    const contentRef = useRef(null);

    const convertToPdf = () => {
        const content = contentRef.current;
        const options = {
            filename: 'my-document.pdf',
            margin: 0,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' },
        };

        html2pdf().set(options).from(content).save();
    };

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

    const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(false);
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

    const customColors = [
        'rgba(255, 99, 132, 0.5)',
        'rgba(53, 162, 235, 0.5)',
        'rgba(255, 244, 136, 0.8)',
    ];

    const months = Object.keys(getChartData());

    const data = {
        labels: months,
        datasets: [
            {
                label: selectedAgent === 'all' ? 'All Agents' : selectedAgent,
                data: months.map((month) => getChartData()[month] || 0),
                backgroundColor: customColors[0],
            },
        ],
    };

    const options = {
        indexAxis: 'x',
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Session Count by Month and Agent',
            },
            legend: {
                display: true,
                position: 'top',
            },
        },
    };

    return (
        <div className='main-header'>
            <h3>MONTH SUMMARY CHART </h3>

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

            {isLoading ? (
                <Spinner size='xl' className='spinner-for-chart' />
            ) : (
                <>
                    <div ref={contentRef}>
                        <Bar className='daywiseCount' options={options} data={data} />
                    </div>
                    <button className='submit-button export' onClick={convertToPdf}>
                        Export to PDF
                    </button>
                </>
            )}
        </div>
    );
}

export default MonthlyChartAllAgent;

