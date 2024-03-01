import { DataGrid } from '@mui/x-data-grid';
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
            setSessions(sessions.reverse());
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

    const rows = sessions.map((session, index) => ({
        id: index + 1,
        date: formatDate(session.created),
        sessions: generateSessionLabel(index),
        StartTime : session.toJSON().activated.toISOString().split("T")[1].split("Z")[0],
        EndTime :   session.toJSON().ended.toISOString().split("T")[1].split("Z")[0],
        duration: calculateDuration(session),
        AgentName : session.agent.name,
    }));

    const columns = [
        { field: 'id', headerName: 'SR', width: 70 },
        { field: 'date', headerName: 'Date', width: 130 },
        { field: 'sessions', headerName: 'Sessions', width: 130 },
        { field: 'StartTime', headerName: 'Start Time', width: 160 },
        { field: 'EndTime', headerName: 'End Time', width: 160 },
        { field: 'duration', headerName: 'Duration', width: 170 },
        { field: 'AgentName', headerName: 'Agent Name', width: 190 },
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
