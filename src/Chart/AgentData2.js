import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import CobrowseAPI from "cobrowse-agent-sdk";
import React, { useEffect, useState } from "react";
import config from "../utils/config";

function AgentData2() {
  const itemsPerPage = 10;
  const [APIdata, setAPIdata] = useState([]);
  const [page, setPage] = useState(1);
  const [toDate, seToDate] = useState("");
  const [fromDate, setFroDate] = useState("");
  const [dateCounts, setDateCounts] = useState({});



  // const [totalCount, setTotalCount] = useState("");

  const today = new Date();
  const firstDateOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const formatToday = `${today.getFullYear()}/${( "0" +(today.getMonth() + 1)).slice(-2)}/${("0" + today.getDate()).slice(-2)}`;
  console.log("formatToday ---", formatToday);
  const formatFirstDateOfMonth = `${firstDateOfMonth.getFullYear()}/${( "0" +(firstDateOfMonth.getMonth() + 1)).slice(-2)}/${("0" + firstDateOfMonth.getDate()).slice(-2)}`;
  console.log("formatFirstDateOfMonth ---", formatFirstDateOfMonth);

  useEffect(() => {
    const fetchData = async () => {
      const agentToken = config.agentToken;
      const cobrowse = new CobrowseAPI(agentToken);

      try {
        const sessions = await cobrowse.sessions.list({
          activated_after: formatFirstDateOfMonth,
          activated_before: formatToday,
          limit: 10000,
        });
        // console.log("API list ----> ", JSON.stringify(sessions));
        //  { [890],}
        const counts = {};
        setAPIdata(sessions);
        sessions.forEach((item) => {
          const date = item.created;
          const newDate = formatDate(date);
          counts[newDate] = (counts[date] || 0) + 1;
        });
        setDateCounts(counts);
      } catch (error) {
        console.error("Error fetching cobrowse data:", error);
      }
    };

    fetchData();
  }, [formatToday, formatFirstDateOfMonth]);

  const convertAndFormatDate = (userInputDate) => {
    console.log("userInputDate-----", userInputDate);
    const date = new Date(userInputDate);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = `0${date.getMonth() + 1}`.slice(-2);
      const day = `0${date.getDate()}`.slice(-2);
      const newDate = `${year}/${month}/${day}`;

      return newDate;
    } else {
      console.error(
        "Invalid date format. Please enter a date in MM/DD/YYYY format."
      );
      return "";
    }
  };

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }

  async function finalDate(toDate, fromDate) {
    const abc = convertAndFormatDate(toDate);
    console.log("formatedDate ----- ", abc);

    const xyz = convertAndFormatDate(fromDate);
    console.log(xyz);

    try {
      const agentToken = config.agentToken;
      const cobrowse = new CobrowseAPI(agentToken);
      const sessions = await cobrowse.sessions.list({
        activated_after: abc,
        activated_before: xyz,
        limit: 1000,
      });
      const counts = {};
      sessions.forEach((item) => {
        const date = formatDate(item.created);
        counts[date] = (counts[date] || 0) + 1;
      });
      console.log("sessions length is --->", sessions.length);
      const currentDateCounts = Object.entries(counts);
      console.log("dates are -->", currentDateCounts);
      currentDateCounts.sort((a, b) => new Date(a[0]) - new Date(b[0]));

      // Calculate total count of all sessions
      // const totalCount = Object.values(counts).reduce((total, count) => total + count, 0);

      setDateCounts(counts);
      setAPIdata(sessions);
      // setTotalCount(totalCount);
    } catch (error) {
      console.error("Error fetching cobrowse data:", error);
    }
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (toDate && fromDate) {
      finalDate(toDate, fromDate);
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

  const handleSessionDetails = (currentDateCounts) => {
    // console.log("gu");
    console.log("currentDateCounts==========> ", currentDateCounts);
    // console.log(APIdata.toJSON())
    let apiDataJSON = APIdata.map((ele) => ele.toJSON());
    console.log(apiDataJSON);
    let filteredApiData = apiDataJSON.map((ele) => {
      let asdf = new Date(ele.created);
      let forDate = asdf.toISOString().split("T");

      return forDate[0] == currentDateCounts[0];
    });

    console.log(filteredApiData);

    // let fu= APIdata.filter
  };

  return (
    <div>
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
        <div>
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
              {currentDateCounts.map(([date, count], index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{date}</td>
                  <td>{count}</td>
                  <td>
                    <button
                      onClick={() =>
                        handleSessionDetails(currentDateCounts[index])
                      }
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
  );
}

export default AgentData2;
