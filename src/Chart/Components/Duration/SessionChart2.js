import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import CobrowseAPI from 'cobrowse-agent-sdk';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import config from '../../../utils/config';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
);

function SessionChart2() {


    
    const formatedDate = (date) => {
        return date.toISOString().split('T')[0];
    };


    const today = new Date();
    const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 0);

    const formattedtwoMonthsAgo = formatedDate(twoMonthsAgo);
    const formattedToday = formatedDate(today);
    
    const [sessions, setSessions] = useState([]);
    const [fromDate, setFromDate] = useState(formattedtwoMonthsAgo)
    const [toDate, setToDate] = useState(formattedToday);

   



    const fetchData = async (startDate, endDate) => {
        const agentToken = config.agentToken;
        const cobrowse = new CobrowseAPI(agentToken);

        try {
            const sessionsData = await cobrowse.sessions.list({
                activated_after: startDate,
                activated_before: endDate,
                limit: 10000,
            });
            sessionsData.reverse()
            console.log("new sessionsData --", sessionsData);
            setSessions(sessionsData);
        } catch (error) {
            console.error('Error fetching cobrowse data:', error);
        }
    };

    useEffect(() => {
        fetchData(formattedtwoMonthsAgo, formattedToday);
    }, [formattedtwoMonthsAgo, formattedToday]);

    const getDurationInMinutes = (startTime, endTime) => {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const DurationTime = ((end - start) / (1000 * 60)).toFixed();
        return DurationTime;
    };

    const labels = sessions.map((session, index) => `Session ${index + 1}`);

    const data1 = sessions.map((session) =>
    getDurationInMinutes(session.created, session.ended))

    console.log("data1 is ----->", data1);

    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        var label = context.dataset.label || '';

                        if (label) {
                            label += ': ';
                        }
                        label += context.parsed.y + ' mins';

                        const sessionIndex = context.dataIndex;
                        if (sessions[sessionIndex]) {
                            label +=
                                ' - ' +
                                new Date(sessions[sessionIndex].created).toLocaleDateString();
                        }

                        return label;
                    },
                },
            },
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Session Duration',
            },
        },
    };

    const data = {
        labels,
        datasets: [
            {
                fill: true,
                label: 'Session Data (In Min)',
                data: data1,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        if (fromDate && toDate) {
            fetchData(fromDate, toDate);
        } else {
            console.error('Invalid date format');
        }
    };

    return (
        <div className='main-header'>
            <h1>Session Duration report Chart</h1>
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
                            required
                            className="input"
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
            <Line className='timeduration' options={options} data={data} />
        </div>
    );
}

export default SessionChart2;
