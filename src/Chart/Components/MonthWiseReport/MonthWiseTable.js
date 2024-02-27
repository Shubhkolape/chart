import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import CobrowseAPI from 'cobrowse-agent-sdk';
import React, { useEffect, useState } from 'react';
import config from '../../../utils/config';
import KnowMoreMonths from './KnowMoreMonths';

function MonthWiseTable() {

    
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
    const [toDate, seToDate] =  useState(formattedToday);



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
                Object.entries(monthly)
                    .sort((a, b) => {
                        console.log("Comparing:", a[0], b[0]);
                        const [aMonth, aYear] = a[0].split('-');
                        const [bMonth, bYear] = b[0].split('-');
                        return bYear - aYear || bMonth - aMonth;
                    })
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

    // const handleCloseModal = () => {
    //   setAPIdata(null);
    // };

    const columns = [
        { field: 'monthYear', headerName: 'Month', width: 150 },
        { field: 'count', headerName: 'Requests Handled', width: 200 },
        {
            field: 'action',
            headerName: 'Action',
            width: 150,
            renderCell: (params) => (
                <Button
                    onClick={() => fetchDetailedSessions(params.row.monthYear)}
                    variant='contained'
                    color='primary'
                >
                    Know More
                </Button>
            ),
        },
    ];

    const rows = Object.entries(monthlyCounts).map(([monthYear, count], index) => ({
        id: index + 1,
        monthYear,
        count,
    }));

    return (
        <div className='main-header'>
            <h2>Monthly Requests for the Selected Period</h2>
            <div>
                <form onSubmit={handleFormSubmit} className='dailycount1'>
                    <div>
                        <label htmlFor='startDate'>From </label>
                        <input
                            type='date'
                            required
                            className="input"
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
                            className="input"
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

            <div>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                
                />
            </div>

          

            {selectedSession && <KnowMoreMonths data={selectedSession} />}
        </div>
    );
}

export default MonthWiseTable;
