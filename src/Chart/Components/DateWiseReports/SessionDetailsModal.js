import React from "react";

function SessionDetailsModal({ data, onClose }) {
  const generateSessionLabel = (index) => {
    return `Session${index + 1}`;
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}></span>
        <h2>Session Details</h2>
        <table>
          <thead>
            <tr>
              <th>SessionNo</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>App Name</th>
              <th>Device Timezone</th>
              {/* <th>Call Duration (in Min)</th> */}
              {/* <th>App Name</th> */}
            </tr>
          </thead>
          <tbody>
            {data.map((session, index) => (
              <tr key={session.id}>
                <td>{generateSessionLabel(index)}</td>
                {/* {console.log(session.toJSON().activated.toISOString())} */}
                {/* {console.log(
                  session.toJSON().activated.toISOString()
                )} */}
                {/* {
                // .split('T')[1].split('Z')[0]
                console.log(
                  "new session date -------", session.toJSON().activated.toISOString().split('T')[0]
                )},
                  {
                console.log(
                  "new session start time -------", session.toJSON().activated.toISOString().split('T')[1].split('Z')[0]
                )},
                 {
                console.log(
                  "new session app_name -------", session.app_name
                )}  */}

                <td>
                  {session.toJSON().activated.toISOString().split("T")[0]}
                </td>
                <td>
                  {
                    session
                      .toJSON()
                      .activated.toISOString()
                      .split("T")[1]
                      .split("Z")[0]
                  }
                </td>
                <td>
                  {
                    session
                      .toJSON()
                      .ended.toISOString()
                      .split("T")[1]
                      .split("Z")[0]
                  }
                </td>
                <td>{session.device.app_name}</td>
                <td>{session.device.device_timezone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SessionDetailsModal;
