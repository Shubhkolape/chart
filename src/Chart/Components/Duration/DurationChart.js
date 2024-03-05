import { Icon } from '@avaya/neo-react';
import CobrowseAPI from 'cobrowse-agent-sdk';
import React, { useEffect, useState } from 'react';
import config from '../../../utils/config';

function SessionTable() {

    const formatedDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const today = new Date();
    const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 0);

    const formattedtwoMonthsAgo = formatedDate(twoMonthsAgo);
    const formattedToday = formatedDate(today);

    const [itemsPerPage, setItemsPerPage] = useState(5);

    const [currentPage, setCurrentPage] = useState(1);

    const [sessions, setSessions] = useState([]);
    const [fromDate, setFromDate] = useState(formattedtwoMonthsAgo)
    const [toDate, setToDate] =  useState(formattedToday);

    const fetchData = async (startDate, endDate) => {
        const agentToken = config.agentToken;
        const cobrowse = new CobrowseAPI(agentToken);

        try {
            const sessions = await cobrowse.sessions.list({
                activated_after: startDate,
                activated_before: endDate,
                limit: 10000,
            });
            const reversedSessions = sessions.reverse()
            setSessions(reversedSessions);
        } catch (error) {
            console.error('Error fetching cobrowse data:', error);
        }
    };

    useEffect(() => {
    fetchData(formattedtwoMonthsAgo, formattedToday);
    }, [formattedtwoMonthsAgo,formattedToday]);

    const handleFormSubmit = (event) => {
        event.preventDefault();
        if (fromDate && toDate) {
            fetchData(fromDate, toDate);
        } else {
            console.error('Invalid date format');
        }
    };

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString('en-US', options);
    }

    


    const calculateDuration = (session) => {
        const activatedTime = new Date(session.activated);
        const endedTime = new Date(session.ended);
    
        const durationInMilliseconds = endedTime - activatedTime;
        const durationInSeconds = Math.floor(durationInMilliseconds / 1000);
        const durationInMinutes = Math.floor(durationInSeconds / 60);
    
        if (durationInMinutes < 1) {
          // If duration is less than 1 minute
          return `${durationInSeconds} sec`;
      } else if (durationInMinutes < 60) {
          // If duration is less than 1 hour
          const seconds = durationInSeconds % 60;
          return `${durationInMinutes} min ${seconds} sec`;
      } else {
          // If duration is 1 hour or more
          const hours = Math.floor(durationInMinutes / 60);
          const minutes = durationInMinutes % 60;
          const seconds = durationInSeconds % 60;
          return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} min ${seconds} sec`;
      }
    };

    const generateSessionLabel = (index) => {
        return `Session${index + 1}`;
    };


    
    const totalPages = Math.ceil(sessions.length / itemsPerPage);

    // Calculate range of data to display
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, sessions.length);

    // Slice the data based on the current page
    const currentData = sessions.slice(startIndex, endIndex);

    // Function to handle page change
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
            <h1>DURATION SUMMARY TABLE</h1>
            <div>
                <form className='dailycount1' onSubmit={handleFormSubmit}>
                    <div>
                        <label htmlFor='startDate'>From </label>
                        <input
                            type='date'
                            required
                            value={fromDate}
                            className="input"
                            onChange={(e) => {
                                setFromDate(e.target.value);
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor='endDate'>To </label>

                        <input
                            type='date'
                            value={toDate}
                            className="input"
                            required
                            onChange={(e) => {
                                setToDate(e.target.value);
                            }}
                        />
                    </div>
                    <button type='submit' className='submit-button' value='Submit'>
                        Submit
                    </button>
                </form>
            </div>

            <div className='dateTable1'>
                <table className='Month-table'>
                    <thead>
                        <tr>
                            <th className='centered-header'>#</th>
                            <th className='centered-header'>Date</th>
                            <th className='centered-header'>Sessions</th>
                            <th className='centered-header'>Start Time</th>
                            <th className='centered-header'>End Time</th>
                            <th className='centered-header'>Duration</th>
                            <th className='centered-header'>Agent Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((session, index) => {
                            const itemIndex = (currentPage - 1) * itemsPerPage + index;
                            return (
                                <tr key={itemIndex}>
                                    <td>{ itemIndex + 1}</td>
                                    <td>{formatDate(session.created)}</td>
                                    <td>{generateSessionLabel(itemIndex)}</td>
                                    <td>{ session.toJSON().activated.toISOString().split("T")[1].split("Z")[0]}</td>
                                    <td>{session.toJSON().ended.toISOString().split("T")[1].split("Z")[0]}</td>
                                    <td>{calculateDuration(session)}</td>
                                    <td>{session.agent.name}</td>
                                   
                                </tr>
                            );
                        })}
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
                    <button  onClick={() => handlePageChange(currentPage - 1)}
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

export default SessionTable;
