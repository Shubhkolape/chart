import React, { useState } from 'react';

const AgentInfoPopup = ({ agent, onClose, onUpdate }) => {
    const [editable, setEditable] = useState(false);
    const [editedAgent, setEditedAgent] = useState({ ...agent });

    const handleUpdate = () => {
        onUpdate(editedAgent);
        onClose();
    };

    const handleSave = () => {
        onUpdate(editedAgent);
        setEditable(false);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedAgent({ ...editedAgent, [name]: value });
    };

    return (
        <div className='agent-info-popup'>
            <div className='content'>
                <h2>View Agent</h2>
                <form onSubmit={handleUpdate}>
                    <label>
                        Agent Name:
                        <input
                            type='text'
                            name='agentname'
                            value={editedAgent.agentname}
                            onChange={handleChange}
                            readOnly
                        />
                    </label>
                    <label>
                        License Number:
                        <input
                            type='text'
                            name='licenseNo'
                            value={editedAgent.licenseNo}
                            onChange={handleChange}
                            readOnly
                        />
                    </label>
                    <label>
                        Token:
                        <textarea
                            name='token'
                            value={editedAgent.token}
                            onChange={handleChange}
                            readOnly
                        />
                    </label>
                    <div className='buttons'>
                        <button type='button' onClick={onClose}>
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AgentInfoPopup;
