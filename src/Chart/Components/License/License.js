import React from 'react';
import agentData from "../../../utils/licenses.json";


// npm install @avaya/neo-react --force

function License() {

    return (
        <div className='main-header'>
            <h2>License Information</h2>
            <table className='Month-table'>
                <thead>
                    <tr>
                        <th className="centered-header">#</th>
                        <th className="centered-header">Agent Name</th>
                        <th className="centered-header">License No</th>
                    </tr>
                </thead>
                <tbody>
                    {agentData &&
                        agentData.map((agent, index) => (
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
