import React, { useState } from 'react';

const DateComp = () => {
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

    const [startDate, setStartDate] = useState(formattedtwoMonthsAgo);
    const [endDate, setEndDate] = useState(formattedToday);

    const convertAndFormatDate = (userInputDate) => {
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
    
    const handleSubmitForDates = async (e) => {
        e.preventDefault();
        const formattedFromDate = convertAndFormatDate(startDate);
        const formattedToDate = convertAndFormatDate(endDate);

        if (selectedAgent === 'all') {
            const { agentSessions, totalSessionCounts } = await fetchDataForAgents(
                formattedFromDate,
                formattedToDate,
            );
            setChartData(agentSessions);
            setTotalSessionCounts(totalSessionCounts);
            console.log('i am here ');
        } else {
            const { agentSessions } = await fetchDataForAgents(
                formattedFromDate,
                formattedToDate,
                selectedAgent,
            );
            setChartData(agentSessions);
            console.log('i am noyt in  here ');
        }
    };


    return (
        <form onSubmit={handleSubmitForDates} className='dailycount1'>
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
                <label htmlFor='endDate'>To</label>
                <input
                    className='input'
                    type='date'
                    id='endDate'
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>
            <div>
                <div className='agent-div'>
                    <label htmlFor='agent'>Agent</label>
                    <select
                        className='agent-label'
                        id='agent'
                        value={selectedAgent}
                        onClick={handleAgentChange}
                    >
                        <option value='all'>All</option>
                        {agentdata.map((agent) => (
                            <option key={agent.agent.name} value={agent.agent.name}>
                                {agent.agent.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <button type='submit' className='submit-button'>
                Submit
            </button>
        </form>
    );
};

export default DateComp;
