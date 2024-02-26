import { DataGrid } from '@mui/x-data-grid';
import CobrowseAPI from 'cobrowse-agent-sdk';
import React, { useEffect, useMemo, useState } from 'react';
import config from '../../../utils/config';

function AvarageTime() {
    // const [APIdata, setAPIdata] = useState([]);
    const [SessionLength, setSessionLength] = useState(null);
    const [AvargeDuration, setAvargeDuration] = useState(null);
    const [TotalDuration, setTotalDuration] = useState(null);


    const formatedDate = (date) => {
        return date.toISOString().split('T')[0];
      };

      

    const today = useMemo(() => new Date(), []);
    const firstDateOfMonth = useMemo(
        () => new Date(today.getFullYear(), today.getMonth(), 1),
        [today],
    );

    const [fromDate, setFromDate] = useState(formatedDate(firstDateOfMonth))
    const [toDate, setToDate] = useState(formatedDate(today));

    // function for convert date format mm-dd-yy to yyyy-mm-dd

    const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        return formattedDate;
    };

    const formatedfirstDateOfMonth = formatDate(firstDateOfMonth);
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
            // setAPIdata(sessions);

            const sessionDurations = sessions.map((session) => calculateSessionDuration(session));

            const totalDuration = sessionDurations.reduce((total, duration) => total + duration, 0);
            const averageDuration = (totalDuration / sessions.length).toFixed(2);
            const sessionlength = sessions.length;

            setSessionLength(sessionlength);
            setAvargeDuration(averageDuration);
            setTotalDuration(totalDuration.toFixed(2));
        } catch (error) {
            console.error('Error fetching cobrowse data:', error);
        }
    };

    useEffect(() => {
        fetchDataforAvageTime(formatedfirstDateOfMonth, formatedToday);
        console.log('formatedfirstDateOfMonth----', formatedfirstDateOfMonth);
        console.log('formatedToday----', formatedToday);
    }, [formatedfirstDateOfMonth, formatedToday]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        fetchDataforAvageTime(fromDate, toDate);
    };

    return (
        <div className='main-header'>
            <h1>Avarage Duration of Agent</h1>
            <div>
                <form className='dailycount1' onSubmit={handleFormSubmit}>
                    <div>
                        <label htmlFor='startDate'>From </label>
                        <input
                            type='date'
                            required
                            className="input"
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
                            className="input"
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

            <DataGrid
                className='dateTable'
                rows={[
                    {
                        id: 1,
                        sessionsHandled: SessionLength,
                        'Total Duration': TotalDuration,
                        'Avarge Duration': AvargeDuration,
                    },
                ]}
                columns={[
                    { field: 'id', headerName: 'Sr.No', width: 100 },
                    {
                        field: 'sessionsHandled',
                        headerName: 'No of Sessions',
                        width: 150,
                    },

                    { field: 'Total Duration', headerName: 'Total Duration (In Min)', width: 200 },

                    {
                        field: 'Avarge Duration',
                        headerName: 'Average Duration (In Min)',
                        width: 200,
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
        </div>
    );
}

export default AvarageTime;
