import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import CobrowseAPI from "cobrowse-agent-sdk";
import React, { useEffect, useState } from "react";
import config from "../../../utils/config";
import KnowMoreMonths from "./KnowMoreMonths";

function MonthWiseTable() {
  const [monthlyCounts, setMonthlyCounts] = useState({});
  const [toDate, seToDate] = useState("");
  const [fromDate, setFroDate] = useState("");
  const [page, setPage] = useState(1);

  const [detailedSessions, setDetailedSessions] = useState(null)
  const [APIdata, setAPIdata] = useState([]);

  // const [detailedSessions, setDetailedSessions] = useState(null);
  useEffect(() => {
    const today = new Date();
    const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 0);
    const formattedTwoMonthsAgo = formatDate(twoMonthsAgo);
    const formattedToday = formatDate(today);
    fetchData(formattedTwoMonthsAgo, formattedToday);
  }, []);

  const fetchData = async (startDate, endDate) => {
    const agentToken = config.agentToken;
    const cobrowse = new CobrowseAPI(agentToken);

    try {
      const sessions = await cobrowse.sessions.list({
        activated_after: startDate,
        activated_before: endDate,
        limit: 10000,
      });
      setAPIdata(sessions);
      const monthly = {};
      sessions.forEach((item) => {
        const date = new Date(item.created);
        const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
        monthly[monthYear] = (monthly[monthYear] || 0) + 1;
      });
      const sortedMonthly = Object.fromEntries(
        Object.entries(monthly).sort(([a], [b]) => {
          const [aMonth, aYear] = a.split("-");
          const [bMonth, bYear] = b.split("-");
          return bYear - aYear || bMonth - aMonth;
        })
      );
      console.log("sortedMonthly----", sortedMonthly);
      setMonthlyCounts(sortedMonthly);
      // setAPIdata(sessions);
      console.log("sessions ----", sessions);
    } catch (error) {
      console.error("Error fetching cobrowse data:", error);
    }
  };

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const manualStartDate = new Date(toDate);
    const manualEndDate = new Date(fromDate);
    const formattedFromDate = formatDate(manualStartDate);
    const formattedToday = formatDate(manualEndDate);
    fetchData(formattedFromDate, formattedToday);
    setPage(1);
  };
  const handleChange = (event, newPage) => {
    setPage(newPage);
  };

  const fetchDetailedSessions = async (monthYear) => {
    try {
      const [month, year] = monthYear.split("-");
      const lastDayOfMonth = new Date(year, month, 0).getDate();
      const startDate = `${year}-${month}-01`;
      const endDate = `${year}-${month}-${lastDayOfMonth}`;

      const agentToken = config.agentToken;
      const cobrowse = new CobrowseAPI(agentToken);

      const sessions = await cobrowse.sessions.list({
        activated_after: startDate,
        activated_before: endDate,
        limit: 10000,
      });
      setAPIdata(sessions);
      console.log("button sesions are -----", sessions);
    } catch (error) {
      console.error("Error fetching detailed session data:", error);
    }
  };

  const handleSessionDetails = async (monthYear) => {
    try {
      const detailedSessionsData = await fetchDetailedSessions(monthYear);
      setDetailedSessions(detailedSessionsData);
    } catch (error) {
      console.error("Error fetching detailed session data:", error);
    }
  };

  const handleCloseModal = () => {
    setAPIdata(null);
  };

  return (
    <div className="Agentmonth">
      <h2>Monthly Requests for the Selected Period</h2>

      <form onSubmit={handleFormSubmit}>
        <div className="user-details">
          <div className="input-box">
            <span className="details">From</span>
            <input
              type="date"
              required
              value={toDate}
              onChange={(e) => {
                seToDate(e.target.value);
              }}
            />
          </div>
          <div className="input-box">
            <span className="details">To</span>
            <input
              type="date"
              value={fromDate}
              required
              onChange={(e) => {
                setFroDate(e.target.value);
              }}
            />
          </div>
          <div className="button">
            <input type="submit" value="Submit" />
          </div>
        </div>
      </form>

      <div>
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Requests Handled</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(monthlyCounts).map(([monthYear, count], index) => (
              <tr key={index}>
                <td>{monthYear}</td>
                <td>{count}</td>
                <td>
                  <button
                   onClick={() => handleSessionDetails(monthYear)}
                   >
                    {" "}
                    Know More
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Stack spacing={12}>
        <Pagination
          // count={totalPages}
          page={page}
          onChange={handleChange}
          color="secondary"
          showFirstButton
          showLastButton
        />
      </Stack>

     
      {detailedSessions && (
        <KnowMoreMonths data={detailedSessions} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default MonthWiseTable;

