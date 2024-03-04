import { Icon } from '@avaya/neo-react';
import CobrowseAPI from 'cobrowse-agent-sdk';
import React, { useEffect, useState } from 'react';
import config from '../../../utils/config';



function AvarageTime() {

    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [AgentStats, setAgentStats] = useState([]);

    const formatedDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const today = new Date();
    const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 0);

    const formattedtwoMonthsAgo = formatedDate(twoMonthsAgo);
    const formattedToday = formatedDate(today);
    const [fromDate, setFromDate] = useState(formattedtwoMonthsAgo);
    const [toDate, setToDate] = useState(formattedToday);


    const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        return formattedDate;
    };

    const formatedfirstDateOfMonth = formatDate(formattedtwoMonthsAgo);
    const formatedToday = formatDate(today);

    const calculateSessionDuration = (session) => {
        const activatedTime = new Date(session.activated);
        // console.log("activatedTime---", activatedTime);
        const endedTime = new Date(session.ended);
        // console.log("endedTime ---", endedTime);
        const durationInMilliseconds = endedTime - activatedTime;
        const durationInMinutes = durationInMilliseconds / (1000 * 60);
        return durationInMinutes;
    };

    
    const fetchDataforAvageTime = async (startdate, enddate) => {
        const agentToken = config.agentToken;
        const cobrowse = new CobrowseAPI(agentToken);

        try {
            const sessions = await cobrowse.sessions.list({
                activated_after: startdate,
                activated_before: enddate,
                limit: 100000,
            });


            const agentData = sessions.reduce((acc, session) => {
                const agentName = session.agent.name;
                const duration = calculateSessionDuration(session);

                if (!acc[agentName]) {
                    acc[agentName] = {
                        sessionCount: 0,
                        totalDuration: 0,
                    };
                }

                acc[agentName].sessionCount += 1;
                acc[agentName].totalDuration += duration;

                return acc;
            }, {});

            const agentStatsArray = Object.keys(agentData).map((agentName) => {
                const { sessionCount, totalDuration } = agentData[agentName];
                const averageDuration = totalDuration / sessionCount;
                return {
                    agentName,
                    sessionCount,
                    totalDuration,
                    averageDuration,
                };
            });

            setAgentStats(agentStatsArray);
        } catch (error) {
            console.error('Error fetching cobrowse data:', error);
        }
    };
    const agentNamesSet = new Set();

    function formatDuration(totalMinutes) {
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
    }




    useEffect(() => {
        fetchDataforAvageTime(formatedfirstDateOfMonth, formatedToday);
    }, [formatedfirstDateOfMonth, formatedToday]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        fetchDataforAvageTime(fromDate, toDate);
    };


  
    const totalPages = Math.ceil(AgentStats.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, AgentStats);


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const handleItemsPerPageChange = (event) => {
        const value = parseInt(event.target.value);
        setItemsPerPage(value);
        setCurrentPage(1);
    };


    return (
        <div className='main-header'>
            <h1>Average Duration report table</h1>
            <div>
                <form className='dailycount1' onSubmit={handleFormSubmit}>
                    <div>
                        <label htmlFor='startDate'>From </label>
                        <input
                            type='date'
                            required
                            className='input'
                            value={fromDate}
                            onChange={(e) => {
                                setFromDate(e.target.value);
                                console.log('from date is --', e.target.value);
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor='endDate'>To </label>
                        <input
                            type='date'
                            value={toDate}
                            required
                            className='input'
                            onChange={(e) => {
                                setToDate(e.target.value);
                            }}
                        />
                    </div>
                    <div className='button'>
                        <input type='submit' className='submit-button' value='Submit' />
                    </div>
                </form>
            </div>

            <div className='dateTable1'>
                <table className='averge-table'>
                    <thead>
                        <tr>
                            <th className='centered-header'>#</th>
                            <th className='centered-header'>No of Session</th>
                            <th className='centered-header'>Total Duration (In Min)</th>
                            <th className='centered-header'>Average Duration</th>
                            <th className='centered-header'>Agent Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {AgentStats.map((agent, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{agent.sessionCount}</td>
                                <td>{formatDuration(agent.totalDuration)}</td>
                                <td>{formatDuration(agent.averageDuration)}</td>
                                <td>{agent.agentName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
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
                        <button onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}>
                            <Icon
                                aria-label='backward-fast'
                                icon='backward-fast'
                                size='sm'

                            />
                        </button>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <Icon
                                aria-label='forward-fast'
                                icon='forward-fast'
                                size='sm'

                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AvarageTime;
