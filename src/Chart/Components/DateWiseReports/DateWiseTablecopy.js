import { Icon, Tooltip } from '@avaya/neo-react';
import CobrowseAPI from 'cobrowse-agent-sdk';
import React, { useEffect, useState } from 'react';
import config from '../../../utils/config';
import SessionDetailsModal from './SessionDetailsModal';


function DateWiseTablecopy() {
    const formatedDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const [itemsPerPage, setItemsPerPage] = useState(5);

    const [currentPage, setCurrentPage] = useState(1);

    const today = new Date();
    const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 0);

    const formattedtwoMonthsAgo = formatedDate(twoMonthsAgo);
    const formattedToday = formatedDate(today);

    const [APIdata, setAPIdata] = useState([]);
    const [dateCounts, setDateCounts] = useState({});
    const [selectedSession, setSelectedSession] = useState(null);
    const [fromDate, setFromDate] = useState(formattedtwoMonthsAgo);
    const [toDate, seToDate] = useState(formattedToday);

    const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        return formattedDate;
    };

    const fetchData = async (startdate, enddate) => {
        const agentToken = config.agentToken;
        const cobrowse = new CobrowseAPI(agentToken);

        try {
            const sessions = await cobrowse.sessions.list({
                activated_after: startdate,
                activated_before: enddate,
                limit: 10000,
            });
            return sessions;
        } catch (error) {
            console.error('Error fetching cobrowse data:', error);
            return [];
        }
    };

    useEffect(() => {
        const fetchAndProcessData = async () => {
            try {
                const sessions = await fetchData(formattedtwoMonthsAgo, formattedToday);
                const counts = {};
                sessions.forEach((item) => {
                    const date = formatDate(new Date(item.created)); // Ensure formatDate is defined
                    counts[date] = (counts[date] || 0) + 1;
                });
                setDateCounts(counts);
                setAPIdata(sessions);
            } catch (error) {
                console.error('Error fetching and processing data:', error);
            }
        };

        fetchAndProcessData();
    }, [formattedtwoMonthsAgo, formattedToday]);

    const finalDate = async (fromDate, toDate) => {
        try {
            const formattedFromDate = convertAndFormatDate(fromDate);
            const formattedToDate = convertAndFormatDate(toDate);

            const sessions = await fetchData(formattedFromDate, formattedToDate);
            const counts = {};
            sessions.forEach((item) => {
                const date = formatDate(new Date(item.created));
                counts[date] = (counts[date] || 0) + 1;
            });
            setDateCounts(counts);
            setAPIdata(sessions);
        } catch (error) {
            console.error('Error fetching and processing data:', error);
        }
    };

    const handleKnowMore = async (date) => {
        const sessionsOnSelectedDate = APIdata.filter(
            (session) => formatDate(new Date(session.created)) === date,
        );
        console.log('sessionsOnSelectedDate---- ', sessionsOnSelectedDate);
        setSelectedSession(sessionsOnSelectedDate);
    };

    const convertAndFormatDate = (userInputDate) => {
        console.log('userInputDate-----', userInputDate);
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

    const handleFormSubmit = (event) => {
        event.preventDefault();
        if (fromDate && toDate) {
            finalDate(fromDate, toDate);
        } else {
            console.error('Invalid date format');
        }
    };

    const handleCloseModal = () => {
        setSelectedSession(null);
    };

    const currentDateCounts = Object.entries(dateCounts).reverse().slice();

    const totalPages = Math.ceil(currentDateCounts.length / itemsPerPage);

    // Calculate range of data to display
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, currentDateCounts.length);

    // Slice the data based on the current page
    const currentData = currentDateCounts.slice(startIndex, endIndex);

    // Function to handle page change
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
            <h2>Daily Session report Table </h2>
            <div>
                <form onSubmit={handleFormSubmit} className='dailycount1'>
                    <div>
                        <label htmlFor='startDate'>From </label>
                        <input
                            type='date'
                            className='input'
                            required
                            value={fromDate}
                            onChange={(e) => {
                                setFromDate(e.target.value);
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor='endDate'>To </label>
                        <input
                            type='date'
                            className='input'
                            value={toDate}
                            required
                            onChange={(e) => {
                                seToDate(e.target.value);
                            }}
                        />
                    </div>
                    <button type='submit' className='submit-button' value='Submit'>
                        Submit
                    </button>
                </form>
            </div>
            <div className='dateTable1'>
                <table className='license-table'>
                    <thead>
                        <tr>
                            <th className='centered-header'>#</th>
                            <th className='centered-header'>Date</th>
                            <th className='centered-header'>Session Handled</th>
                            <th className='centered-header'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map(([date, count], index) => {
                            const itemIndex = (currentPage - 1) * itemsPerPage + index + 1;
                            return (
                                <tr key={itemIndex}>
                                    <td>{itemIndex}</td>
                                    <td>{date}</td>
                                    <td>{count}</td>
                                    <td>
                                        {
                                            <Tooltip
                                                className='icon'
                                                onClick={() => handleKnowMore(date)}
                                                label='Sessions Details'
                                                position='top'
                                                multiline={false}
                                            >
                                                <Icon
                                                    aria-label='info icon'
                                                    icon='info'
                                                    size='lg'
                                                />
                                            </Tooltip>
                                        }
                                    </td>
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
            {selectedSession && (
                    <SessionDetailsModal data={selectedSession} onClose={handleCloseModal} />
                )}
        </div>
    );
}

export default DateWiseTablecopy;
