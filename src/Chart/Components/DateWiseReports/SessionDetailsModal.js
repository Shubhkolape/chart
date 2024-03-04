import { Icon } from '@avaya/neo-react';
import React, { useState } from 'react';

function SessionDetailsModal({ data }) {
    const calculateDuration = (session) => {
        const activatedTime = new Date(session.activated);
        const endedTime = new Date(session.ended);

        const durationInMilliseconds = endedTime - activatedTime;
        const durationInSeconds = Math.floor(durationInMilliseconds / 1000);
        const durationInMinutes = Math.floor(durationInSeconds / 60);

        if (durationInMinutes < 1) {
            // If duration is less than 1 minute
            return `${durationInSeconds} sec`;
        } else if (durationInMinutes < 60) {
            // If duration is less than 1 hour
            const seconds = durationInSeconds % 60;
            return `${durationInMinutes} min ${seconds} sec`;
        } else {
            // If duration is 1 hour or more
            const hours = Math.floor(durationInMinutes / 60);
            const minutes = durationInMinutes % 60;
            const seconds = durationInSeconds % 60;
            return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} min ${seconds} sec`;
        }
    };

    const [itemsPerPage, setItemsPerPage] = useState(5);

    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    // Calculate range of data to display
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, data.length);

    // Slice the data based on the current page
    const currentData = data.slice(startIndex, endIndex);

    // Function to handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (event) => {
        const value = parseInt(event.target.value);
        setItemsPerPage(value);
        setCurrentPage(1); // Reset to first page when changing items per page
    };

  
    const generateSessionLabel = (index) => {
        return `Session${index}`;
    };

    return (
        <div className='modal'>
            <div className='modal-content'>
                {/* <span className='close' onClick={onClose}></span> */}
                <h2>Session Details</h2>
                <table className='session-details-table'>
                    <thead>
                        <tr>
                            <th className='centered-header'>#</th>
                            <th className='centered-header'>Date</th>
                            <th className='centered-header'>Start Time</th>
                            <th className='centered-header'>End Time</th>
                            <th className='centered-header'>End Time</th>
                            <th className='centered-header'>Duration</th>
                            <th className='centered-header'>App Name</th>
                            <th className='centered-header'>Device Timezone</th>
                            <th className='centered-header'>Agent Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((session, index) => {
                            const itemIndex = (currentPage - 1) * itemsPerPage + index + 1;
                            return (
                                <tr key={itemIndex}>
                                    <td>{generateSessionLabel(itemIndex)}</td>
                                    <td>
                                        {session.toJSON().activated.toISOString().split('T')[0]}
                                    </td>
                                    <td>
                                        {
                                            session
                                                .toJSON()
                                                .activated.toISOString()
                                                .split('T')[1]
                                                .split('Z')[0]
                                        }
                                    </td>
                                    <td>
                                        {
                                            session
                                                .toJSON()
                                                .ended.toISOString()
                                                .split('T')[1]
                                                .split('Z')[0]
                                        }
                                    </td>
                                    <td>{calculateDuration(session)}</td>
                                    <td>{calculateDuration(session)}</td>
                                    <td>{session.device.app_name}</td>
                                    <td>{session.device.device_timezone}</td>
                                    <td>{session.agent.name}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className='pagination'>
                <div>
                    Rows per page:{' '}
                    <select
                        className='select'
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </div>

                <div className='pagination-button'>
                <span>
                        {currentPage} of {totalPages}
                    </span>
                    <button  onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}>
                        <Icon
                            aria-label='backward-fast'
                            icon='backward-fast'
                            size='sm'
                           
                        />
                    </button>
                   
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                       <Icon
                            aria-label='forward-fast'
                            icon='forward-fast'
                            size='sm'
                           
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SessionDetailsModal;
