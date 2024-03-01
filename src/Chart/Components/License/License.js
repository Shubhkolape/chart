import CobrowseAPI from 'cobrowse-agent-sdk';
import React, { useEffect, useState } from 'react';
import config from '../../../utils/config';


// npm install @avaya/neo-react --force

function License() {

    const formatedDate = (date) => {
        return date.toISOString().split('T')[0];
    };


    const today = new Date();
    const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 0);

   
    const formattedtwoMonthsAgo = formatedDate(twoMonthsAgo);
    const formattedToday = formatedDate(today);

   
    const [selectedSession, setSelectedSession] = useState([]);

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
                limit: 5,
            });
            setSelectedSession(sessions);
      
           
        } catch (error) {
            console.error('Error fetching cobrowse data:', error);
        }
    };


    // const columns = [
    //     { field: "SrNo", headerName: "Sr No", width: 120 },
    //     { field: "AgnetName", headerName: "AgnetName", width: 120 },
    //     { field: "LicenseNumber", headerName: "License Number", width: 150 },
    //   ];

    //   const rows = selectedSession.map((session, index) => ({
    //     id: session.id,
    //     sessionNo: index + 1,
    //     AgentName :session.agent.name,
    //     LicenseNumber : session.agent.id

    
    //   }));

    return (
        <div className='license-info'>
            <h2>License Information</h2>
            <table className='neo-table neo-table--bordered'>
                <thead>
                    <tr>
                        <th>Sr.No</th>
                        <th>Agent Name</th>
                        <th>License No</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedSession &&
                        selectedSession.map((agent, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{agent.agent.name}</td>
                                <td>{agent.agent.id}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}

export default License;
