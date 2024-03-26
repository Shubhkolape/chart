import React, { useState } from 'react';
function AddNewAgent({ setShowForm, handleClosePopUp, SetLicensesData }) { // Changed setLicensesData to SetLicensesData
    const [agentName, setAgentName] = useState('');
    const [licenseKey, setLicenseKey] = useState('');
    const [accountId, setAccountId] = useState('');
    const [token, setToken] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newAgent = {
            agentName,
            licenseKey,
            accountId,
            token,
        };

        fetch('https://rahul.lab.bravishma.com/cobrowse/accounts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newAgent),
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to add agent');
            }
        })
        .then((data) => {
            SetLicensesData(prevData => [...prevData, data]); // Changed to SetLicensesData
            setAgentName('');
            setLicenseKey('');
            setAccountId('');
            setToken('');
            setShowForm(false);
            handleClosePopUp();
        })
        .catch((error) => {
            console.error('Error adding agent:', error);
        });
    };

    return (
        <div className='popup' style={{ display: 'block' }}>
            <form onSubmit={handleSubmit}>
                <div
                    className='popup-container'
                    style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}
                >
                    <div className='input-filed'>
                        <label className='input-label'>Agent Name:</label>
                        <input
                            className='box-input'
                            type='text'
                            value={agentName}
                            onChange={(e) => setAgentName(e.target.value)}
                        />
                    </div>
                    <div className='input-filed'>
                        <label className='input-label'>License Key:</label>
                        <input
                            className='box-input'
                            type='text'
                            required
                            value={licenseKey}
                            onChange={(e) => setLicenseKey(e.target.value)}
                        />
                    </div>
                    <div className='input-filed'>
                        <label className='input-label'>Account ID:</label>
                        <input
                            className='box-input'
                            type='text'
                            value={accountId}
                            required 
                            onChange={(e) => setAccountId(e.target.value)}
                        />
                    </div>
                    <div className='input-filed'>
                        <label className='input-label'>Token:</label>
                        <textarea
                            rows={5}
                            className='box-input'
                            type='text'
                            value={token}
                            required
                            onChange={(e) => setToken(e.target.value)}
                        />
                    </div>
                    <button type='submit' className='submit-button'>
                        Add New Agent
                    </button>
                    <button className='submit-button' onClick={() => setShowForm(false)}>
                        Close
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddNewAgent;
