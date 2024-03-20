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

function MultiAgentMonthlyChart2() {
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

    const formatedDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const today = new Date();
    const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 0);

    const formattedtwoMonthsAgo = formatedDate(twoMonthsAgo);
    const formattedToday = formatedDate(today);
    const [chartData, setChartData] = useState([]);

    const [toDate, seToDate] = useState(formattedtwoMonthsAgo);
    const [fromDate, setFroDate] = useState(formattedToday);

    const [isLoading, setIsLoading] = useState(true);

    // const [A1monthlyCounts, setA1MonthlyCounts] = useState({});

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
                const mainsessions = sessions.reverse();

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
        setIsLoading(false);
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

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const manualStartDate = new Date(toDate);
        const manualEndDate = new Date(fromDate);
        const formattedFromDate = formatDate(manualStartDate);
        const formattedToday = formatDate(manualEndDate);
        const agentSessions1 = await fetchDataForAgents(formattedFromDate, formattedToday);
        setChartData(agentSessions1);
        //   setPage(1);
    };

    const customColors = [
        'rgba(255, 99, 132, 0.5)',
        'rgba(53, 162, 235, 0.5)',
        'rgba(255, 244, 136, 0.8)',
    ];

    const months = chartData.length > 0 ? Object.keys(chartData[0].sessionCounts) : [];

    const data = {
        labels: months,
        datasets: chartData.map((agentData, index) => ({
            label: agentData.agentName,
            data: months.map((month) => agentData.sessionCounts[month] || 0),
            backgroundColor: customColors[index % customColors.length],
        })),
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
            <h2>AGENT SESSIONS DETAILS CHART</h2>
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

            {isLoading ? (
                <Spinner size='xl' className='spinner-for-chart' />
            ) : (
                <>
                    <div ref={contentRef}>
                        <Bar className='daywiseCount' options={options} data={data} />
                    </div>
                        <button className='submit-button export1    ' onClick={convertToPdf}>
                            Export to PDF
                        </button>
                </>
            )}

            {/* <AgentTable/> */}
        </div>
    );
}

export default MultiAgentMonthlyChart2;
