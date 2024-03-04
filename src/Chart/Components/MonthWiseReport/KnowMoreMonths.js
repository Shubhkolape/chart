import { Icon } from '@avaya/neo-react';
import React, { useState } from "react";


function KnowMoreMonths({ data }) {


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
        setCurrentPage(1); 
    };


  const calculateDuration = (session) => {
    const activatedTime = new Date(session.activated);
    const endedTime = new Date(session.ended);
    const durationInMilliseconds = endedTime - activatedTime;
    const durationInSeconds = Math.floor(durationInMilliseconds / 1000);
    const durationInMinutes = Math.floor(durationInSeconds / 60);

    if (durationInMinutes < 1) {
      return `${durationInSeconds} sec`;
  } else if (durationInMinutes < 60) {
      const seconds = durationInSeconds % 60;
      return `${durationInMinutes} min ${seconds} sec`;
  } else {
      const hours = Math.floor(durationInMinutes / 60);
      const minutes = durationInMinutes % 60;
      const seconds = durationInSeconds % 60;
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} min ${seconds} sec`;
  }
};


  const columns = [
    { field: "sessionNo", headerName: "SessionNo", width: 120 },
    { field: "date", headerName: "Date", width: 120 },
    { field: "startTime", headerName: "Start Time", width: 150 },
    { field: "endTime", headerName: "End Time", width: 150 },
    { field: "Duration", headerName: "Duration", width: 170 },
    { field: "appName", headerName: "App Name", width: 150 },
    { field: "deviceTimezone", headerName: "Device Timezone", width: 180 },
    { field: "AgentName", headerName: "Agent Name", width: 180 },
  ];

  const rows = currentData.map((session, index) => ({
    id: session.id,
    sessionNo: index + 1,
    date: session.toJSON().activated.toISOString().split("T")[0],
    startTime: session
      .toJSON()
      .activated.toISOString()
      .split("T")[1]
      .split("Z")[0],
    endTime: session.toJSON().ended.toISOString().split("T")[1].split("Z")[0],
    Duration : calculateDuration(session),
    appName: session.device.app_name,
    deviceTimezone: session.device.device_timezone,
    AgentName :session.agent.name,

  }));

  return (
    <div className="modal">
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
                                    <td>{itemIndex}</td>
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

export default KnowMoreMonths;


