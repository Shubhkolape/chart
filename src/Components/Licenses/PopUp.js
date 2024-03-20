import React from 'react';

function PopUp({ selectedAgent, handleClosePopUp }) {
    return (
        <div className='popup' style={{ display: 'block' }}>
            <div
                className='popup-container'
                style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}
            >
                <div className='input-filed'>
                    <p>
                        <strong className='input-label'>Name :</strong>
                        <input className='box-input' type='text' value={selectedAgent.agentName} readOnly />
                    </p>
                    <p>
                        <strong className='input-label'>License :</strong>
                        <input className='box-input' type='text' readOnly value={selectedAgent.licenseKey} />
                    </p>
                    <p>
                        <strong className='input-label'>Account ID :</strong>
                        <input className='box-input' type='text' readOnly value={selectedAgent._id} />
                    </p>

                    <p>
                        <strong className='input-label'>Token :</strong>
                        <textarea className='box-input' type='text' readOnly value={selectedAgent.token} />
                    </p>
                </div>
                <button className='submit-button' onClick={handleClosePopUp}>
                    Close
                </button>
            </div>
        </div>
    );
}

export default PopUp;
