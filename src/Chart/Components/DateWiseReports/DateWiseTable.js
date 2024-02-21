import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import CobrowseAPI from "cobrowse-agent-sdk";
import React, { useEffect, useMemo, useState } from "react";
import config from "../../../utils/config";
import ChartForDailySessionCountDate from "./ChartForDailySessionCountDate";
import SessionDetailsModal from "./SessionDetailsModal";

function DateWiseTable() {
  const today = useMemo(() => new Date(), []);
  const firstDateOfMonth = useMemo(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
    [today]
  );
  const [APIdata, setAPIdata] = useState([]);
  const [dateCounts, setDateCounts] = useState({});
  const [selectedSession, setSelectedSession] = useState(null);

  const [fromDate, setFromDate] = useState(firstDateOfMonth);
  const [toDate, seToDate] = useState(new Date(Date.now()));

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async (startdate, enddate) => {
    const agentToken = config.agentToken;
    const cobrowse = new CobrowseAPI(agentToken);

    try {
      const sessions = await cobrowse.sessions.list({
        activated_after: startdate,
        activated_before: enddate,
        limit: 10000,
      });
      return sessions;
    } catch (error) {
      console.error("Error fetching cobrowse data:", error);
      return [];
    }
  };

  const handleKnowMore = async (date) => {
    const sessionsOnSelectedDate = APIdata.filter(
      (session) => formatDate(new Date(session.created)) === date
    );
    console.log("sessionsOnSelectedDate---- ", sessionsOnSelectedDate);
    setSelectedSession(sessionsOnSelectedDate);
  };

  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        const sessions = await fetchData(firstDateOfMonth, today);
        const counts = {};
        sessions.forEach((item) => {
          const date = formatDate(new Date(item.created)); // Ensure formatDate is defined
          counts[date] = (counts[date] || 0) + 1;
        });
        setDateCounts(counts);
        setAPIdata(sessions);
      } catch (error) {
        console.error("Error fetching and processing data:", error);
      }
    };

    fetchAndProcessData();
  }, [firstDateOfMonth, today]);

  const convertAndFormatDate = (userInputDate) => {
    console.log("userInputDate-----", userInputDate);
    const date = new Date(userInputDate);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = `0${date.getMonth() + 1}`.slice(-2);
      const day = `0${date.getDate()}`.slice(-2);
      const newDate = `${year}-${month}-${day}`;

      return newDate;
    } else {
      throw new Error(
        "Invalid date format. Please enter a date in MM/DD/YYYY format."
      );
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

  const finalDate = async (fromDate, toDate) => {
    try {
      const formattedFromDate = convertAndFormatDate(fromDate);
      const formattedToDate = convertAndFormatDate(toDate);

      const sessions = await fetchData(formattedFromDate, formattedToDate);
      const counts = {};
      sessions.forEach((item) => {
        const date = formatDate(new Date(item.created));
        counts[date] = (counts[date] || 0) + 1;
      });
      setDateCounts(counts);
      setAPIdata(sessions);
    } catch (error) {
      console.error("Error fetching and processing data:", error);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (fromDate && toDate) {
      finalDate(fromDate, toDate);
      setPage(1);
    } else {
      console.error("Invalid date format");
    }
  };

  const handleChange = (event, newPage) => {
    setPage(newPage);
  };

  const totalPages = Math.ceil(Object.keys(dateCounts).length / itemsPerPage);

  const currentDateCounts = Object.entries(dateCounts).slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleCloseModal = () => {
    setSelectedSession(null);
  };

  return (
    <div className="Agentdata2">
      <h1>Day wise data of agent </h1>
      <form onSubmit={handleFormSubmit}>
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
                seToDate(e.target.value);
              }}
            />
          </div>
          <div className="button">
            <input type="submit" value="Submit" />
          </div>
        </div>
      </form>

      <div className="dateTable1">
        <table>
          <thead>
            <tr>
              <th>Sr.No</th>
              <th>Date</th>
              <th>Session Handled</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* {currentDateCounts.map(([date, count], index) ))} */}

            {currentDateCounts.map(([date, count], index) => {
              console.log("fu----", currentDateCounts);
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{date}</td>
                  <td>{count}</td>
                  <td>
                    <button onClick={() => handleKnowMore(date)}>
                      Know More
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="date-stack">
          <Stack spacing={2}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChange}
              // shape="rounded"
              color="secondary"
              showFirstButton
              showLastButton
            />
          </Stack>
        </div>

        {selectedSession && (
          <SessionDetailsModal
            data={selectedSession}
            onClose={handleCloseModal}
            // calculateCallDuration={calculateCallDuration}
          />
        )}
      </div>

      <ChartForDailySessionCountDate />
    </div>
  );
}

export default DateWiseTable;
