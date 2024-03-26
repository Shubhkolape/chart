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
// SessionDurationChart
function SessionDurationChart({startDate, endDate, handleStartDateChange, handleEndDateChange}) {
    const contentRef = useRef(null);

    const convertToPdf = () => {
        const content = contentRef.current;
        const options = {
            filename: 'my-chart.pdf',
            margin: 1,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 4 },
            jsPDF: {
                unit: 'cm',
                format: 'letter',
                orientation: 'landscape',
            },
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
    const [allAgents, setAllAgents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDataForAgents = async (startDate, endDate, agentName = null) => {
        try {
            const response = await fetch('https://rahul.lab.bravishma.com/cobrowse/accounts');
            const agentData = await response.json();
            const fetchedAgentSessions = [];

            const agentsToFetch = agentName
                ? agentData.filter((agent) => agent.agentName === agentName)
                : agentData;


            for (const agent of agentsToFetch) {
                const cobrowse = new CobrowseAPI(agent.token);
                try {
                    const sessions = await cobrowse.sessions.list({
                        activated_after: startDate,
                        activated_before: endDate,
                        limit: 10000,
                    });
                    const mainSessions = sessions.reverse();
                    const agentSessionData = mainSessions.map((session) => ({
                        duration: calculateSessionDuration(session),
                        startDate: formatDate(session.activated),
                    }));
                    fetchedAgentSessions.push({
                        agentName: agent.agentName,
                        sessionDurations: agentSessionData,
                    });
                } catch (error) {
                    console.error(`Error fetching cobrowse data for agent:`, error);
                }
            }
            return fetchedAgentSessions;
        } catch (error) {
            console.error(`Error fetching cobrowse data:`, error);
            
        }
    };



    useEffect(() => {
        const fetchAndProcessData = async () => {
            try {
                const agentSessions = await fetchDataForAgents(
                    startDate,
                    endDate,
                );
                setChartData(agentSessions);
                setAllAgents(agentSessions.map((agent) => agent.agentName));
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching and processing data:', error);
                setIsLoading(false);
            }
        };
        fetchAndProcessData();
    }, [startDate, endDate]);

    // console.log("chartData-=-=-=-=-=-=-=-=", chartData);

    const handleAgentChange = (e) => {
        setSelectedAgent(e.target.value);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);
        try {
            const agentSessions1 = await fetchDataForAgents(
                formattedStartDate,
                formattedEndDate,
                selectedAgent === 'all' ? null : selectedAgent,
            );
            setChartData(agentSessions1);
        } catch (error) {
            console.error('Error handling form submit:', error);
        }
    };

    const calculateSessionDuration = (session) => {
        const activatedTime = new Date(session.activated);
        const endedTime = new Date(session.ended);
        const durationInMilliseconds = endedTime - activatedTime;
        const durationInMinutes = durationInMilliseconds / (1000 * 60);
        return {
            minutes: durationInMinutes,
            formatted: formatDuration(durationInMinutes),
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

    const bgColor = [
        'rgba(255, 244, 136, 0.8)',
        'rgba(53, 162, 235, 0.5)',
        'rgba(255, 99, 132, 0.5)',
    ];

    const labels =
        chartData.length > 0 && chartData[0].sessionDurations
            ? chartData[0].sessionDurations.map((_, index) => `Session ${index + 1}`)
            : [];

    const data = {
        labels: labels,
        datasets: chartData.map((agentData, index) => ({
            label: agentData.agentName,
            data: agentData.sessionDurations.map((session) => session.duration.minutes),
            hoverText: agentData.sessionDurations.map(
                (session) => `${formatDate(session.startDate)}: ${session.duration.formatted}`,
            ),
            // borderColor: customColors[index % customColors.length],
            backgroundColor: bgColor[index % bgColor.length],
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
                    label: function (context) {
                        const hoverText = context.dataset.hoverText[context.dataIndex];
                        return hoverText;
                    },
                },
            },
        },
    };
    return (
        <div className='main-header'>
            <h3>DURATION SUMMARY CHART</h3>
            <div>
                <form className='dailycount1' onSubmit={handleFormSubmit}>
                    <div>
                        <label htmlFor='startDate'>From </label>

                        <input
                            type='date'
                            required
                            value={startDate}
                            className='input'
                            onChange={(e) => handleStartDateChange(e.target.value)}

                        />
                    </div>
                    <div>
                        <label htmlFor='endDate'>To </label>
                        <input
                            type='date'
                            value={endDate}
                            required
                            className='input'
                            onChange={(e) => handleEndDateChange(e.target.value)}

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
                            {allAgents.map((agentName, index) => (
                                <option key={index} value={agentName}>
                                    {agentName}
                                </option>
                            ))}
                        </select>
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
                        <Line className='daywiseCount' data={data} options={options} />
                    </div>
                    <button className='submit-button export' onClick={convertToPdf}>
                        Export to PDF
                    </button>
                </>
            )}
        </div>
    );
}

export default SessionDurationChart;
