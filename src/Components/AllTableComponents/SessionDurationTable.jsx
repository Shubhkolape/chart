import { Spinner } from '@avaya/neo-react';
import CobrowseAPI from 'cobrowse-agent-sdk';
import html2pdf from 'html2pdf.js';
import React, { useEffect, useRef, useState } from 'react';
// SessionDurationTable
function SessionDurationTable({
    startDate,
    endDate,
    handleStartDateChange,
    handleEndDateChange,
}) {
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

    const [selectedAgent, setSelectedAgent] = useState('all');
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [allAgents, setAllAgents] = useState([]);

    const fetchDataForAgents = async (startDate, endDate, agentName = null) => {
        try {
            const response = await fetch('https://rahul.lab.bravishma.com/cobrowse/accounts');
            const agentdata = await response.json();
            const agentSessions = [];

            const agentsToFetch = agentName
                ? agentdata.filter((agent) => agent.agentName === agentName)
                : agentdata;

            for (const agent of agentsToFetch) {
                const cobrowse = new CobrowseAPI(agent.token);
                try {
                    const sessions = await cobrowse.sessions.list({
                        activated_after: startDate,
                        activated_before: endDate,
                        limit: 10000,
                    });
                    const sessionCounts = {};
                    let totalDuration = 0;

                    sessions.forEach((session) => {
                        const date = formatDate(new Date(session.activated));
                        sessionCounts[date] = (sessionCounts[date] || 0) + 1;
                        totalDuration += calculateSessionDuration(session);
                    });

                    agentSessions.push({
                        agentName: agent.agentName,
                        sessionCounts: sessionCounts,
                        totalSessions: sessions.length,
                        totalDuration: totalDuration,
                        averageDuration: sessions.length > 0 ? totalDuration / sessions.length : 0,
                    });
                } catch (error) {
                    console.error(`Error fetching cobrowse data for agent:`, error);
                }
            }
            setIsLoading(false);
            return agentSessions;
        } catch (error) {
            console.error('Error fetching agent data:', error);
        }
    };

    useEffect(() => {
        const fetchAndProcessData = async () => {
            try {
                const agentSessions = await fetchDataForAgents(startDate, endDate);
                setChartData(agentSessions);
                setAllAgents(agentSessions.map((agent) => agent.agentName));
                setIsLoading(false);
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

    // const handleKnowMore = async (date) => {
    //     const sessionsOnSelectedDate = sessionDetails.filter(
    //         (session) => formatDate(new Date(session.created)) === date,
    //     );
    //     console.log('sessionsOnSelectedDate---- ', sessionsOnSelectedDate);
    //     setSelectedDateSessionDetails(sessionsOnSelectedDate);
    //     setShowSessionDetailsModal(true);
    // };

    const handleSubmitForDates = async (e) => {
        e.preventDefault();
        const formattedFromDate = convertAndFormatDate(startDate);
        const formattedToDate = convertAndFormatDate(endDate);

        try {
            let agentSessions1;

            if (selectedAgent === 'all') {
                agentSessions1 = await fetchDataForAgents(formattedFromDate, formattedToDate);
            } else {
                agentSessions1 = await fetchDataForAgents(
                    formattedFromDate,
                    formattedToDate,
                    selectedAgent,
                );
            }

            setChartData(agentSessions1);
        } catch (error) {
            console.error('Error handling dates:', error);
        }
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
            <h3>AVERAGE DURATION CHART</h3>

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
                    <div className='agent-div'>
                        <label htmlFor='agent'>Agent</label>
                        <select
                            id='agent'
                            className='agent-label'
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
                    <button type='submit' className='submit-button'>
                        Submit
                    </button>
                </form>
            </div>

            <div className='dateTable1'>
                <div className='table-div' ref={contentRef}>
                    {isLoading ? (
                        <Spinner size='xl' className='spinner-for-table' />
                    ) : (
                        <>
                            <table className='Month-table'>
                                <thead>
                                    <tr>
                                        <th className='centered-header'>#</th>
                                        <th className='centered-header'>Agent Name</th>
                                        <th className='centered-header'>No. of Sessions</th>
                                        <th className='centered-header'>Total Duration</th>
                                        <th className='centered-header'>Average Duration</th>
                                        {/* <th className='centered-header'>Action</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {chartData.map((agentData, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{agentData.agentName}</td>
                                            <td>{agentData.totalSessions}</td>
                                            <td>{formatDuration(agentData.totalDuration)}</td>
                                            <td>{formatDuration(agentData.averageDuration)}</td>
                                            {/* <td>
                                    <Tooltip
                                        className='icon'
                                        label='Sessions Details'
                                        position='top'
                                        multiline={false}
                                    >
                                        <Icon
                                            onClick={() => handleKnowMore(agentData)}
                                            aria-label='info icon'
                                            icon='info'
                                            size='lg'
                                        />
                                    </Tooltip>
                                </td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </div>
            <button className='submit-button export' onClick={convertToPdf}>
                Export to PDF
            </button>
        </div>
    );
}

export default SessionDurationTable;
