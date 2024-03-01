import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import CobrowseAPI from 'cobrowse-agent-sdk';
import { React, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import config from '../../../utils/config';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Agent() {
    const formatedDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const today = new Date();
    const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 0);

    const formattedtwoMonthsAgo = formatedDate(twoMonthsAgo);
    const formattedToday = formatedDate(today);

    const [A1monthlyCounts, setA1MonthlyCounts] = useState({});

    const fetchData = async (startDate, endDate) => {
        const agentToken = config.agentToken;
        const cobrowse = new CobrowseAPI(agentToken);

        try {
            const sessions1 = await cobrowse.sessions.list({
                activated_after: startDate,
                activated_before: endDate,
                limit: 10000,
            });

            const A1monthly = {};

            // Aggregate data from both agents
            sessions1.forEach((item) => {
                const date = new Date(item.created);
                const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
                A1monthly[monthYear] = (A1monthly[monthYear] || 0) + 1;
            });

            setA1MonthlyCounts(A1monthly);
        } catch (error) {
            console.error('Error fetching cobrowse data:', error);
        }
    };

    useEffect(() => {
        fetchData(formattedtwoMonthsAgo, formattedToday);
    }, [formattedtwoMonthsAgo, formattedToday]);

    const sortedKeysA1 = Object.keys(A1monthlyCounts).sort((a, b) => {
        const [monthA, yearA] = a.split('-').map(Number);
        const [monthB, yearB] = b.split('-').map(Number);

        // Sort by year in descending order
        if (yearA !== yearB) {
            return yearB - yearA;
        }
        // If years are equal, sort by month in descending order
        return monthB - monthA;
    });

    sortedKeysA1.reverse();
    // Construct a new object using the sorted keys
    const sortedDataA1 = {};
    sortedKeysA1.forEach((key) => {
        sortedDataA1[key] = A1monthlyCounts[key]; // Access monthlyCounts instead of data
    });
    const keys1 = Object.keys(sortedDataA1);
    const values1 = Object.values(sortedDataA1);

    const labels = keys1.map((key) => {
        const [month, year] = key.split('-');
        return `${month}/${year}`;
    });

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Chart.js Bar Chart',
            },
        },
    };

    const data = {
        labels,
        datasets: [
            {
                label: 'Agent 1',
                data: values1,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Agent 2',
                data: values1,
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: 'Agent 3',
                data: values1,
                backgroundColor: '#ff5733',
            },
        ],
    };

    return (
        <div className='main-header'>
            <Bar className='daywiseCount' options={options} data={data} />
        </div>
    );
}

export default Agent;
