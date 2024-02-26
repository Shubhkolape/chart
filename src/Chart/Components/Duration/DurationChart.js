import { DataGrid } from '@mui/x-data-grid';
import CobrowseAPI from 'cobrowse-agent-sdk';
import React, { useEffect, useMemo, useState } from 'react';
import config from '../../../utils/config';

function SessionTable() {



    const today = useMemo(() => new Date(), []);
     const fifteendaysAgo = useMemo(() => {
        const fifteendaysAgoDate = new Date(today);
        fifteendaysAgoDate.setDate(today.getDate() - 20);
        return fifteendaysAgoDate;
      }, [today]);
      
    const formatedDate = (date) => {
        return date.toISOString().split('T')[0];
      };



    const [sessions, setSessions] = useState([]);
    const [fromDate, setFromDate] = useState(formatedDate(fifteendaysAgo))
    const [toDate, setToDate] =  useState(formatedDate(today));

    const fetchData = async (startDate, endDate) => {
        const agentToken = config.agentToken;
        const cobrowse = new CobrowseAPI(agentToken);

        try {
            const sessions = await cobrowse.sessions.list({
                activated_after: startDate,
                activated_before: endDate,
                limit: 10000,
            });
            setSessions(sessions);
        } catch (error) {
            console.error('Error fetching cobrowse data:', error);
        }
    };

    useEffect(() => {
      
        fetchData(fifteendaysAgo, today);
    }, [fifteendaysAgo,today]);

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

    function calculateDuration(startTime, endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const duration = Math.abs(end - start) / (1000 * 60);
        return duration.toFixed(2);
    }

    const generateSessionLabel = (index) => {
        return `Session${index + 1}`;
    };

    const rows = sessions.map((session, index) => ({
        id: index + 1,
        date: formatDate(session.created),
        sessions: generateSessionLabel(index),
        duration: calculateDuration(session.created, session.ended),
    }));

    const columns = [
        { field: 'id', headerName: 'SR', width: 70 },
        { field: 'date', headerName: 'Date', width: 130 },
        { field: 'sessions', headerName: 'Sessions', width: 130 },
        { field: 'duration', headerName: 'Duration (Min)', width: 160 },
    ];

    return (
        <div className='main-header'>
            <h1>Agent Session Duration </h1>
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

            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                checkboxSelection
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
            />
        </div>
    );
}

export default SessionTable;
