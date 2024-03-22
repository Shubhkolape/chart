import React from 'react';

function DeleteData({ selectedAgent, handleClosePopUp, setLicensesData }) {
    const handleDelete = (event) => {
        event.preventDefault()
        
        fetch(`https://rahul.lab.bravishma.com/cobrowse/accounts/${selectedAgent._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })  
        .then(response => {
            if (response.ok) {
                setLicensesData(prevData => prevData.filter(agent => agent._id !== selectedAgent._id));
                handleClosePopUp();
            } else {
                throw new Error('Failed to delete data');
            }
        })
        .catch(error => {
            console.error('Error deleting data:', error);
        });
    };

    return (
        <div className='popup' style={{ display: 'block' }}>
            <div className='popup-container'>
                <h2>Delete Data</h2>
                <p>Are you sure you want to delete this data?</p>
                <button className='submit-button' onClick={handleDelete}>Delete</button>
                <button className='submit-button' onClick={handleClosePopUp}>Cancel</button>
            </div>
        </div>
    );
}

export default DeleteData;
