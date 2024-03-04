import { Icon, Tooltip } from '@avaya/neo-react';
import CobrowseAPI from 'cobrowse-agent-sdk';
import React, { useEffect, useState } from 'react';
import config from '../../../utils/config';
import KnowMoreMonths from './KnowMoreMonths';


function MonthWiseTable() {

    const [itemsPerPage, setItemsPerPage] = useState(5);

    const [currentPage, setCurrentPage] = useState(1);



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

    const [monthlyCounts, setMonthlyCounts] = useState({});
    const [fromDate, setFromDate] = useState(formattedtwoMonthsAgo);
    const [toDate, seToDate] = useState(formattedToday);

    const [page, setPage] = useState(formatedDate(today));
    const [selectedSession, setSelectedSession] = useState(null);

    useEffect(() => {
        fetchData(formattedtwoMonthsAgo, formattedToday);
    }, [formattedtwoMonthsAgo, formattedToday]);

    const fetchData = async (startDate, endDate) => {
        const agentToken = config.agentToken;
        const cobrowse = new CobrowseAPI(agentToken);

        try {
            const sessions = await cobrowse.sessions.list({
                activated_after: startDate,
                activated_before: endDate,
                limit: 10000,
            });
            const monthly = {};
            sessions.forEach((item) => {
                const date = new Date(item.created);
                const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
                monthly[monthYear] = (monthly[monthYear] || 0) + 1;
            });
            const sortedMonthly = Object.fromEntries(
                Object.entries(monthly).sort((a, b) => {
                    // console.log('Comparing:', a[0], b[0]);
                    const [aMonth, aYear] = a[0].split('-');
                    const [bMonth, bYear] = b[0].split('-');
                    return bYear - aYear || bMonth - aMonth;
                }),
            );
            setMonthlyCounts(sortedMonthly);
        } catch (error) {
            console.error('Error fetching cobrowse data:', error);
        }
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        // const manualStartDate = new Date(toDate);
        // const manualEndDate = new Date(fromDate);
        const formattedFromDate = formatDate(fromDate);
        const formattedToday = formatDate(toDate);
        fetchData(formattedFromDate, formattedToday).catch((error) =>
            console.error('Error fetching and processing data:', error),
        );
        //   setPage(1);
    };

    const fetchDetailedSessions = async (monthYear) => {
        try {
            const [month, year] = monthYear.split('-');
            const lastDayOfMonth = new Date(year, month, 0).getDate();
            const startDate = `${year}-${month}-01`;
            const endDate = `${year}-${month}-${lastDayOfMonth}`;

            const agentToken = config.agentToken;
            const cobrowse = new CobrowseAPI(agentToken);

            const sessions = await cobrowse.sessions.list({
                activated_after: startDate,
                activated_before: endDate,
                limit: 10000,
            });
            setSelectedSession(sessions);

            console.log('button sesions are -----', sessions);
        } catch (error) {
            console.error('Error fetching detailed session data:', error);
        }
    };


    const Monthdata =  Object.entries(monthlyCounts).reverse()


    const totalPages = Math.ceil(Monthdata.length / itemsPerPage);

    // Calculate range of data to display
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, Monthdata.length);

    // Slice the data based on the current page
    const currentData = Monthdata.slice(startIndex, endIndex);

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
            <h2>Monthly Session report Table</h2>
            <div>
                <form onSubmit={handleFormSubmit} className='dailycount1'>
                    <div>
                        <label htmlFor='startDate'>From </label>
                        <input
                            type='date'
                            required
                            className='input'
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
                <table className='Month-table'>
                    <thead>
                        <tr>
                            <th className='centered-header'>#</th>
                            <th className='centered-header'>Month</th>
                            <th className='centered-header'>Requests Handled</th>
                            <th className='centered-header'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map(([monthYear, count], index) => {
                            const itemIndex = (currentPage - 1) * itemsPerPage + index ;
                            return (
                                <tr key={itemIndex}>
                                    <td>{itemIndex + 1}</td>
                                    <td>{monthYear}</td>
                                    <td>{count}</td>
                                    <td>
                                        {
                                            <Tooltip
                                                className='icon'
                                                onClick={() => fetchDetailedSessions(monthYear)}
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

            {selectedSession && <KnowMoreMonths data={selectedSession} />}
        </div>
    );
}

export default MonthWiseTable;
