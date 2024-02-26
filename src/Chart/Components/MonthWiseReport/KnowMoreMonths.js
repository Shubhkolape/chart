import { DataGrid } from "@mui/x-data-grid";
import React from "react";

function KnowMoreMonths({ data }) {
  // const generateSessionLabel = (index) => {
  //   return `Session${index + 1}`;
  // };

  const columns = [
    { field: "sessionNo", headerName: "SessionNo", width: 120 },
    { field: "date", headerName: "Date", width: 120 },
    { field: "startTime", headerName: "Start Time", width: 150 },
    { field: "endTime", headerName: "End Time", width: 150 },
    { field: "appName", headerName: "App Name", width: 150 },
    { field: "deviceTimezone", headerName: "Device Timezone", width: 180 },
    { field: "AgentName", headerName: "Agent Name", width: 180 },
  ];

  const rows = data.map((session, index) => ({
    id: session.id,
    sessionNo: index + 1,
    date: session.toJSON().activated.toISOString().split("T")[0],
    startTime: session
      .toJSON()
      .activated.toISOString()
      .split("T")[1]
      .split("Z")[0],
    endTime: session.toJSON().ended.toISOString().split("T")[1].split("Z")[0],
    appName: session.device.app_name,
    deviceTimezone: session.device.device_timezone,
    AgentName :session.agent.name,

  }));

  return (
    <div className="modal">
      <div className="modal-content">
        {/* <span className="close" onClick={onClose}>X</span> */}
        <h2>Session Details</h2>

        <DataGrid
          className="dateTable"
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          // checkboxSelection
        />
      </div>
    </div>
  );
}

export default KnowMoreMonths;


