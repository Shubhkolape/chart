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
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
// AllAgentMonthlyTable  
function AllAgentMonthlyTable({
    startDate,
    endDate,
    handleStartDateChange,
    handleEndDateChange,
}
) {
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

    // const formatedDate = (date) => {
    //     return date.toISOString().split('T')[0];
    // };

    // const today = new Date();
    // const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 0);

    // const formattedtwoMonthsAgo = formatedDate(twoMonthsAgo);
    // const formattedToday = formatedDate(today);


    
    // const [fromDate, setFroDate] = useState(formattedtwoMonthsAgo);
    // const [toDate, seToDate] = useState(formattedToday);
    
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
    
        try {
            const response = await fetch('https://rahul.lab.bravishma.com/cobrowse/accounts'); 
            const agentData = await response.json();
    
            for (const agent of agentData) {
                const cobrowse = new CobrowseAPI(agent.token);
                try {
                    const sessions = await cobrowse.sessions.list({
                        activated_after: startDate,
                        activated_before: endDate,
                        limit: 10000,
                    });
    
                    const sessionCounts = {};
    
                    sessions.forEach((session) => {
                        const date = formatDate(new Date(session.activated));
                        const month = date.slice(0, 7);
                        sessionCounts[month] = (sessionCounts[month] || 0) + 1;
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
            } catch (error) {
                console.error('Error fetching and processing data for all agents:', error);
            }
        };

        fetchAndProcessData();
    }, [startDate, endDate]);

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const formattedFromDate = formatDate(startDate);
        const formattedToday = formatDate(endDate);
        const agentSessions1 = await fetchDataForAgents(formattedFromDate, formattedToday);
        setChartData(agentSessions1);
        //   setPage(1);
    };

    const months = chartData.length > 0 ? Object.keys(chartData[0].sessionCounts) : [];

    return (
        <div className='main-header'>
            <h2>AGENT SESSIONS DETAILS TABLE</h2>
            <div>
                <form onSubmit={handleFormSubmit} className='dailycount1'>
                    <div>
                        <label htmlFor='startDate'>From </label>
                        <input
                            type='date'
                            required
                            className='input'
                            value={startDate}
                            onChange={(e) => handleStartDateChange(e.target.value)}

                        />
                    </div>
                    <div>
                        <label htmlFor='endDate'>To </label>
                        <input
                            type='date'
                            className='input'
                            value={endDate}
                            required
                            onChange={(e) => handleEndDateChange(e.target.value)}

                        />
                    </div>
                    <button type='submit' className='submit-button' value='Submit'>
                        Submit
                    </button>
                </form>
            </div>
            <div className='table-div'>
                <>
                    {isLoading ? (
                        <Spinner size='xl' className='spinner-for-table' />
                    ) : (
                        <table className='license-table-agent' ref={contentRef}>
                            <thead>
                                <tr>
                                    <th className='centered-header'>#</th>
                                    <th className='centered-header'>Agent Name</th>
                                    {months.map((month) => (
                                        <th className='centered-header' key={month}>
                                            {month}
                                        </th>
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
                    )}
                </>
            </div>
            <button className='submit-button export1' onClick={convertToPdf}>
                Export to PDF
            </button>
        </div>
    );
}

export default AllAgentMonthlyTable;
