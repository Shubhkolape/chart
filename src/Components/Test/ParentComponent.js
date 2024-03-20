import React, { useEffect, useState } from 'react';
import AgentInfoPopup from './AgentInfoPopup';
import Table from './Table';

const ParentComponent = () => {
    const [data, setData] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        fetch('https://rahul.lab.bravishma.com/cobrowse/accounts')
            .then((response) => response.json())
            .then((data) => setData(data))
            .catch((error) => console.error('Error fetching data:', error));
    };

    const onView = (agent) => {
        setSelectedAgent(agent);
        setShowPopup(true);
    };

    const onEdit = (agent) => {
        setSelectedAgent(agent);
        setShowPopup(true);
    };

    const onDelete = (agentid) => {
        console.log(`Deleting agent with ID ${agentid}`);
        fetch(`https://rahul.lab.bravishma.com/cobrowse/accounts/${agentid}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to delete agent');
                }

                setData(data.filter((agent) => agent.agentid !== agentid));
            })
            .catch((error) => console.error('Error deleting agent:', error));
    };

    const onUpdateAgent = (agentid, newData) => {
        fetch(`https://rahul.lab.bravishma.com/cobrowse/accounts/${agentid}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
        })
            .then((response) => {
                if (!response.ok) {
                    onClosePopup();
                } else {
                    throw new Error('Failed to update agent');
                }
                fetchData();
            })
            .catch((error) => console.error('Error updating agent:', error));
    };

    const onClosePopup = () => {
        setShowPopup(false);
    };

    return (
        <div>
            <h1>Agent List</h1>
            <Table
                data={data}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                onUpdate={onUpdateAgent}
            />
            {showPopup && (
                <AgentInfoPopup
                    data={data}
                    agent={selectedAgent}
                    onClose={onClosePopup}
                    onUpdate={onUpdateAgent}
                />
            )}
        </div>
    );
};

export default ParentComponent;
