import React, { useEffect, useState } from 'react';

const UpdatData = ({ selectedAgent, handleClosePopUp, LicensesData, SetLicensesData }) => {
  const [updatedData, setUpdatedData] = useState(selectedAgent);
  const [changes, setChanges] = useState({}); 

  useEffect(() => {
    setChanges({});
  }, [selectedAgent]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
    setChanges({ ...changes, [name]: value }); 
  };

  const handleUpdate = async () => {
    try {
      const modifiedFields = Object.keys(changes);
  
      if (!modifiedFields.length) {
        console.log('No changes to update');
        return;
      }
  
      const updatedAgent = { ...updatedData }; 
      for (const field of modifiedFields) {
        updatedAgent[field] = changes[field];
      }
  
      const response = await fetch(
        `https://rahul.lab.bravishma.com/cobrowse/accounts/${selectedAgent._id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedAgent),
        }
      );
  
      if (response.ok) {
        const updatedResponse = await response.json();
        setUpdatedData(updatedResponse); 
        handleClosePopUp();
  
        // Update the data in the parent component
        const updatedLicensesData = LicensesData.map(agent => {
          if (agent._id === updatedResponse._id) {
            return updatedResponse;
          }
          return agent;
        });
        SetLicensesData(updatedLicensesData);
      } else {
        throw new Error('Failed to update data');
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
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
            // disabled 
          />
        </div>
        <div className='input-filed'>
          <label className='input-label'>Token</label>
          <textarea
            rows={5}
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

export default UpdatData;
