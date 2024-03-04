import {
  CategoryScale,
  Chart as ChartJS,
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function ChartForDailySessionCountDate() {
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

    const [dateCounts, setDateCounts] = useState({});
    const [chartData, setChartData] = useState([]);

    const [startDate, setStartDate] = useState(formattedtwoMonthsAgo);
    const [endDate, setEndDate] = useState(formattedToday);

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

                const counts = sessions.reduce((acc, item) => {
                    const date = formatDate(new Date(item.created));
                    acc[date] = (acc[date] || 0) + 1;
                    return acc;
                }, {});

                const chartDataArray = Object.entries(counts).map(([date, count]) => ({
                    date,
                    count,
                }));

                setDateCounts(counts);
                console.log('counts----', counts);
                setChartData(chartDataArray);
            } catch (error) {
                console.error('Error fetching and processing data:', error);
            }
        };

        fetchAndProcessData();
    }, [formattedtwoMonthsAgo, formattedToday]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formattedFromDate = convertAndFormatDate(startDate);
            const formattedToDate = convertAndFormatDate(endDate);

            const sessions = await fetchData(formattedFromDate, formattedToDate);

            const counts = sessions.reduce((acc, item) => {
                const date = formatDate(new Date(item.created));
                acc[date] = (acc[date] || 0) + 1;
                return acc;
            }, {});

            const chartDataArray = Object.entries(counts).map(([date, count]) => ({
                date,
                count,
            }));

            setChartData(chartDataArray);
        } catch (error) {
            console.error('Error fetching and processing data:', error);
        }
    };

    chartData.sort((a, b) => new Date(b.date) - new Date(a.date));
    chartData.reverse();
    const labelsDetails = chartData.map((dataPoint) => dataPoint.date);
    const dataDetails = chartData.map((dataPoint) => dataPoint.count);

    const labels = labelsDetails;
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Date Wise Session Count',
            },
        },
    };

    const data = {
        labels,
        datasets: [
            {
                label: 'Count',
                data: dataDetails,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };
    return (
        <div className='main-header'>
            <h2>Daily Session report Chart </h2>

            <div>
                <form onSubmit={handleSubmit} className='dailycount1'>
                    <div>
                        <label htmlFor='startDate'>From</label>
                        <input
                            className='input'
                            type='date'
                            id='startDate'
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor='endDate'>To </label>
                        <input
                            className='input'
                            type='date'
                            id='endDate'
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <button type='submit' className='submit-button'>
                        Submit
                    </button>
                </form>
            </div>
            <Line className='daywiseCount' options={options} data={data} />
        </div>
    );
}

export default ChartForDailySessionCountDate;
