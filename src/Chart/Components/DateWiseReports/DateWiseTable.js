import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import CobrowseAPI from 'cobrowse-agent-sdk';
import React, { useEffect, useMemo, useState } from 'react';
import config from '../../../utils/config';
import SessionDetailsModal from './SessionDetailsModal';

function DateWiseTable() {

  const formatedDate = (date) => {
    return date.toISOString().split('T')[0];
  };
    const today = useMemo(() => new Date(), []);
    const firstDateOfMonth = useMemo(
        () => new Date(today.getFullYear(), today.getMonth(), 1),
        [today],
    );
    const [APIdata, setAPIdata] = useState([]);
    const [dateCounts, setDateCounts] = useState({});
    const [selectedSession, setSelectedSession] = useState(null);
    const [fromDate, setFromDate] = useState(formatedDate(firstDateOfMonth))
    const [toDate, seToDate] =useState(formatedDate(today));

    const [page, setPage] = useState(1);
    const itemsPerPage = 10;



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

    const handleKnowMore = async (date) => {
        const sessionsOnSelectedDate = APIdata.filter(
            (session) => formatDate(new Date(session.created)) === date,
        );
        console.log('sessionsOnSelectedDate---- ', sessionsOnSelectedDate);
        setSelectedSession(sessionsOnSelectedDate);
    };

    useEffect(() => {
        const fetchAndProcessData = async () => {
            try {
                const sessions = await fetchData(firstDateOfMonth, today);
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
    }, [firstDateOfMonth, today]);

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

    const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        return formattedDate;
    };

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

    const handleFormSubmit = (event) => {
        event.preventDefault();
        if (fromDate && toDate) {
            finalDate(fromDate, toDate);
            setPage(1);
        } else {
            console.error('Invalid date format');
        }
    };

    const handleChange = (event, newPage) => {
        setPage(newPage);
    };

    const totalPages = Math.ceil(Object.keys(dateCounts).length / itemsPerPage);

    const currentDateCounts = Object.entries(dateCounts).slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage,
    );

    const handleCloseModal = () => {
        setSelectedSession(null);
    };

    return (
        <div className='main-header'>
            <h1>Day wise data of agent </h1>
            <div>
                <form onSubmit={handleFormSubmit} className='dailycount1'>
                    <div>
                        <label htmlFor='startDate'>From </label>
                        <input
                            type='date'
                            className="input"
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
            <div className='dateTable1'>
                <DataGrid
                    className='dateTable'
                    rows={currentDateCounts.map(([date, count], index) => ({
                        id: index + 1,
                        date: date,
                        sessionsHandled: count,
                    }))}
                    columns={[
                        { field: 'id', headerName: 'Sr.No', width: 100 },
                        { field: 'date', headerName: 'Date', width: 150 },
                        {
                            field: 'sessionsHandled',
                            headerName: 'Session Handled',
                            width: 100,
                        },
                        {
                            field: 'action',
                            headerName: 'Action',
                            width: 140,
                            renderCell: (params) => (
                                <Button
                                    onClick={() => handleKnowMore(params.row.date)}
                                    variant='contained'
                                    color='primary'
                                >
                                    Know More
                                </Button>
                            ),
                        },
                    ]}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                />

                {selectedSession && (
                    <SessionDetailsModal data={selectedSession} onClose={handleCloseModal} />
                )}
            </div>
        </div>
    );
}

export default DateWiseTable;
