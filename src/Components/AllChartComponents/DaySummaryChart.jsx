import { Spinner } from '@avaya/neo-react';
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
import html2pdf from 'html2pdf.js';
import React, { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
// DaySummaryChart
function DaySummaryChart({startDate, endDate, handleStartDateChange, handleEndDateChange}) {
    const contentRef = useRef(null);

    const convertToPdf = () => {
        const content = contentRef.current;
        const options = {
            filename: 'my-document.pdf',
            margin: 0,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2  },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' },
        };

        html2pdf().set(options).from(content).save();
    };

    const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    };

    // const formatedDate = (date) => {
    //     return date.toISOString().split('T')[0];
    // };

    // const today = new Date();
    // const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 0);
    // const formattedtwoMonthsAgo = formatedDate(twoMonthsAgo);
    // const formattedToday = formatedDate(today);


    // const [startDate, setStartDate] = useState(formattedtwoMonthsAgo);
    // const [endDate, setEndDate] = useState(formattedToday);


    const [selectedAgent, setSelectedAgent] = useState('all');
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    

    const fetchDataForAgents = async (startDate, endDate, agentName = null) => {
        const agentSessions = [];

        try {
            const response = await fetch('https://rahul.lab.bravishma.com/cobrowse/accounts');
            const agentData = await response.json();
    
            const agentsToFetch = agentName
                ? agentData.filter(agent => agent.agentName === agentName)
                : agentData;
    
            for (const agent of agentsToFetch) {
                const cobrowse = new CobrowseAPI(agent.token);
                try {
                    const sessions = await cobrowse.sessions.list({
                        activated_after: startDate,
                        activated_before: endDate,
                        limit: 10000,
                    });
    
                    const sessionCounts = {};
                    sessions.reverse().forEach((session) => {
                        const date = formatDate(new Date(session.activated));
                        sessionCounts[date] = (sessionCounts[date] || 0) + 1;
                    });
    
                    agentSessions.push({
                        agentName: agent.agentName,
                        sessionCounts: sessionCounts,
                    });
                } catch (error) {
                    console.error(`Error fetching cobrowse data for agent:`, error);
                }
            }
        } catch (error) {
            console.error('Error fetching agent data:', error);
        }
        setIsLoading(false);
        return agentSessions;
    };

    useEffect(() => {
        const fetchAndProcessData = async () => {
            try {
                const agentSessions = await fetchDataForAgents(
                    startDate,
                    endDate,
                );
                setChartData(agentSessions);
                console.log("chartData is -=-=-=-=-", chartData);
            } catch (error) {
                console.error('Error fetching and processing data for all agents:', error);
            }
        };

        fetchAndProcessData();
    }, [startDate, endDate]);

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
            setChartData(agentSessions1); 
        }
    };

    const handleAgentChange = (e) => {
        setSelectedAgent(e.target.value); 
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

    // const customColors = [

    //     // 'rgb(55, 140, 231)',
    //     // 'rgb(103, 198, 227)'
    // ];

    const dates = Object.keys(getChartData());

    const data = {
        labels: dates,
        datasets: [
            {
                label: selectedAgent === 'all' ? 'All Agents' : selectedAgent,
                data: dates.map((date) => getChartData()[date] || 0),
                backgroundColor: 'rgb(83, 86, 255)',
            },
        ],
    };

    const options = {
        indexAxis: 'x',
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Session Count by Date and Agent',
            },
            legend: {
                display: true,
                position: 'top',
            },
        },
    };

    return (
        <div className='main-header'>
            <h3>DAY SUMMARY CHART</h3>

            <div>
                <form onSubmit={handleSubmitForDates} className='dailycount1'>
                    <div>
                        <label htmlFor='startDate'>From</label>
                        <input
                            className='input'
                            type='date'
                            id='startDate'
                            value={startDate}
                            onChange={(e) => handleStartDateChange(e.target.value)}

                        />
                    </div>
                    <div>
                        <label htmlFor='endDate'>To</label>
                        <input
                            className='input'
                            type='date'
                            id='endDate'
                            value={endDate}
                            onChange={(e) => handleEndDateChange(e.target.value)}

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
                                {chartData.map((agent) => (
                                    <option key={agent.agentName} value={agent.agentName}>
                                        {agent.agentName}
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
                        <Line className='daywiseCount' options={options} data={data} />
                    </div>
                    <button className='submit-button export' onClick={convertToPdf}>
                        Export to PDF
                    </button>
                </>
            )}
        </div>
    );
}

export default DaySummaryChart;

