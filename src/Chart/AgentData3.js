import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import CobrowseAPI from "cobrowse-agent-sdk";
import React, { useEffect, useState } from "react";
import config from "../utils/config";


function AgentData3() {

  const pageSize = 10;
  const [sessions, setSessions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // const FromDate = "2024-02-01";
  // const ToDate = "2024-02-15";

  const fetchSessions = async () => {
    const agentToken = config.agentToken;
    const cobrowse = new CobrowseAPI(agentToken);
    try {
      const response = await cobrowse.sessions.list({
        activated_after: fromDate,
        activated_before: toDate,
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
      });
      const data = response.data;
      setSessions(data.sessions);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };


  const getDateRange = () => {
    const currentDate = new Date();
    const currentMonthFirstDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const firstDate = currentMonthFirstDate.toISOString().split("T")[0];
    const currentdate = currentDate.toISOString().split("T")[0];
    return { fromDate, toDate };
  };

  // const { firstDate, currentdate } = getDateRange();
   
  useEffect(() => {
    const fetchSessions = async () => {
      const { firstDate, currentdate } = getDateRange();
      const agentToken = config.agentToken;
      const cobrowse = new CobrowseAPI(agentToken);
      try {
        const response = await cobrowse.sessions.list({
          activated_after: firstDate,
          activated_before: currentdate,
          limit: pageSize,
          offset: (currentPage - 1) * pageSize,
        });
        const data = response.data;
        setSessions(data.sessions);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    }

    fetchSessions()
  }, []);

  
  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (toDate && fromDate) {
      setCurrentPage(1);
      fetchSessions();
    } else {
      console.error("Invalid date format");
    }
  };


  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };


  return (
    <div>
    <h2>Session Counts by Date</h2>
    <div>
      <form onSubmit={handleFormSubmit}>
        <label>From:</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <label>To:</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Count</th>
        </tr>
      </thead>
      <tbody>
        {sessions.map((session) => (
          <tr key={session.id}>
            <td>{session.created.split("T")[0]}</td>
            <td>{session.count}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div>
      <Stack spacing={2}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
        />
      </Stack>
    </div>
  </div>
  );
}

export default AgentData3;
