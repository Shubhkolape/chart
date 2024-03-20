import React, { useState } from 'react';

const EditData = ({ selectedAgent, handleClosePopUp }) => {
    const [updatedData, setUpdatedData] = useState(selectedAgent);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData({ ...updatedData, [name]: value });
    };

    const handleUpdate = () => {
        fetch(`https://rahul.lab.bravishma.com/cobrowse/accounts/${selectedAgent._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        })
            .then((response) => {
                if (response.ok) {
                    handleClosePopUp();
                } else {
                    throw new Error('Failed to update data');
                }
            })
            .catch((error) => {
                console.error('Error updating data:', error);
            });
    };

    return (
        <div className='popup' style={{ display: 'block' }}>
            <div className='popup-container editData'>
                <h4>Update Agent Info</h4>
                <div className='input-filed'>
                    <label className='input-label'>agentName:</label>
                    <input
                        className='box-input'
                        type='text'
                        name='agentName'
                        value={updatedData.agentName}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='input-filed'>
                    <label className='input-label'>License Key:</label>
                    <input
                        className='box-input'
                        type='text'
                        name='licenseKey'
                        value={updatedData.licenseKey}
                        onChange={handleInputChange}
                    />
                </div>

                <div className='input-filed'>
                    <label className='input-label'>Account ID</label>
                    <input
                        className='box-input'
                        type='text'
                        name='_id'
                        value={updatedData._id}
                        onChange={handleInputChange}
                    />
                </div>

                <div className='input-filed'>
                    <label className='input-label'>Token</label>
                    <textarea
                        className='box-input'
                        type='text'
                        name='token'
                        value={updatedData.token}
                        onChange={handleInputChange}
                    />
                </div>

                <div className='buttons'>
                    <button className='submit-button' onClick={handleUpdate}>
                        Update
                    </button>
                    <button className='submit-button' onClick={handleClosePopUp}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditData;
