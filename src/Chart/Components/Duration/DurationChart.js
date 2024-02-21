import CobrowseAPI from "cobrowse-agent-sdk";
import React, { useEffect, useState } from "react";
import config from "../../../utils/config";

function SessionTable() {
  const [sessions, setSessions] = useState([]);
  const [toDate, setToDate] = useState("");
  const [fromDate, setFromDate] = useState("");

  const fetchData = async (startDate, endDate) => {
    const agentToken = config.agentToken;
    const cobrowse = new CobrowseAPI(agentToken);

    try {
      const sessions = await cobrowse.sessions.list({
        activated_after: startDate,
        activated_before: endDate,
        limit: 10000,
      });
      setSessions(sessions);
    } catch (error) {
      console.error("Error fetching cobrowse data:", error);
    }
  };

  useEffect(() => {
    const today = new Date();
    const fiveDaysAgo = new Date(today);
    fiveDaysAgo.setDate(today.getDate() - 5);
    fetchData(fiveDaysAgo, today);
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (fromDate && toDate) {
      fetchData(fromDate, toDate);
    } else {
      console.error("Invalid date format");
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return date.toLocaleDateString("en-US", options);
  }

  function calculateDuration(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = Math.abs(end - start) / (1000 * 60);
    return duration.toFixed(2);
  }

  const generateSessionLabel = (index) => {
    return `Session${index + 1}`;
  };

  return (
    <div>
      <h1>Table for Agent Session Duration </h1>
      <form className="Agentdata2" onSubmit={handleFormSubmit}>
        <div className="user-details">
          <div className="input-box">
            <span className="details">From</span>
            <input
              type="date"
              required
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
              }}
            />
          </div>
          <div className="input-box">
            <span className="details">To</span>
            <input
              type="date"
              value={toDate}
              required
              onChange={(e) => {
                setToDate(e.target.value);
              }}
            />
          </div>
          <div className="button">
            <input type="submit" value="Submit" />
          </div>
        </div>
      </form>
      <table className=" Duration-table">
        <thead>
          <tr>
            <th>SR</th>
            <th>Date</th>
            <th>Sessions</th>
            <th>Duration (Min)</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{formatDate(session.created)}</td>
              <td>{generateSessionLabel(index)}</td>
              <td>{calculateDuration(session.created, session.ended)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SessionTable;
