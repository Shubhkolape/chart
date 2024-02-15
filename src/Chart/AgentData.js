import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import CobrowseAPI from "cobrowse-agent-sdk";
import React, { useEffect, useState } from "react";
import config from "../utils/config";

function AgentData() {
  const itemsPerPage = 10;
  const [APIdata, setAPIdata] = useState([]);
  const [page, setPage] = useState(1);
  const [toDate, seToDate] = useState("");
  const [formDate, setFormDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const agentToken = config.agentToken;
      const cobrowse = new CobrowseAPI(agentToken);

      try {
        const sessions = await cobrowse.sessions.list({
          // activated_after: "2024-01-08",
          // activated_before: "2024-02-10",
          limit: 10,
        });
        const sessionIds = sessions.map((session) => session.id);
        // const sessionlist = sessions.map(session => session.list);
        console.log("API list ----> ", JSON.stringify(sessions));
        setAPIdata(sessionIds);
      } catch (error) {
        console.error("Error fetching cobrowse data:", error);
      }
    };

    fetchData();
  }, []);

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

  async function finalDate(toDate, formDate) {
    const abc = convertAndFormatDate(toDate);
    console.log("formatedDate ----- ", abc);

    const xyz = convertAndFormatDate(formDate);
    console.log(xyz);

    try {
      const agentToken = config.agentToken;
      const cobrowse = new CobrowseAPI(agentToken);
      const sessions = await cobrowse.sessions.list({
        activated_after: abc,
        activated_before: xyz,
        limit: 1000,
      });

      const sessionIds = sessions.map((session) => session.id);
      const nhfg = sessions.map((session) => session);
      console.log("Specific date data ---->", nhfg);
      setAPIdata(sessionIds);
    } catch (error) {
      console.error("Error fetching cobrowse data:", error);
    }
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (toDate && formDate) {
      finalDate(toDate, formDate);

      const start = new Date(toDate);
      const end = new Date(formDate);
      const datesArray = [];
      let currentDate = start;

      while (currentDate <= end) {
        datesArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      setRenderedDates(datesArray);
    } else {
      console.error("Invalid date format");
    }
  };

  const [renderedDates, setRenderedDates] = useState([]);

  const totalSerialNo = (page - 1) * itemsPerPage + 1;
  const handleChange = (event, newPage) => {
    setPage(newPage);
  };

  const totalPages = Math.ceil(APIdata.length / itemsPerPage);

  const currentPageData = APIdata.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <div className="user-details">
          <div className="input-box">
            <span className="details">To</span>
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
            <span className="details">From</span>
            <input
              type="date"
              value={formDate}
              required
              onChange={(e) => {
                setFormDate(e.target.value);
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
              <th>S.N</th>
              <th>Date</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((id, index) => {
              const date = renderedDates[index]
                ? renderedDates[index].toDateString()
                : "";
              return (
                <tr key={index}>
                  <td>{totalSerialNo + index}</td>
                  <td>{date}</td>
                  <td>{id}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
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

export default AgentData;
