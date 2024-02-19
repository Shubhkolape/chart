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
  const [fromDate, setFroDate] = useState("");



  const today = new Date();
  const formatToday = `${today.getFullYear()}/${("0" +(today.getMonth() + 1)).slice(-2)}/${("0" + today.getDate()).slice(-2)}`;
  const previousDate = new Date(today);
  previousDate.setDate(previousDate.getDate() - 10);
  const formatPreviousDate = `${previousDate.getFullYear()}/${("0" +(previousDate.getMonth() + 1)).slice(-2)}/${("0" + previousDate.getDate()).slice(-2)}`;

  useEffect(() => {
    const fetchData = async () => {
      const agentToken = config.agentToken;
      const cobrowse = new CobrowseAPI(agentToken);
      try {
        const sessions = await cobrowse.sessions.list({
          activated_after: formatToday,
          activated_before: formatPreviousDate,
          limit: 10000,
        });
        const sessionIds = sessions.map((session) => session.id);
        console.log("API list ----> ", JSON.stringify(sessions));
        setAPIdata(sessionIds);
            } catch (error) {
        console.error("Error fetching cobrowse data:", error);
      }
    };

    fetchData();
  }, [formatToday, formatPreviousDate]);



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


  async function finalDate(toDate, fromDate) {

    const userFromdate = convertAndFormatDate(fromDate);
    console.log(userFromdate);
    const UserInputDate = convertAndFormatDate(toDate);
    console.log("formatedDate ----- ", UserInputDate);
    try {
      const agentToken = config.agentToken;
      const cobrowse = new CobrowseAPI(agentToken);
      const sessions = await cobrowse.sessions.list({
        activated_after: userFromdate,
        activated_before: UserInputDate,
        limit: 1000,
      });
      
      const sessionIds = sessions.map((session) => session.id);
      // console.log(" all sessionIds ---->", sessionIds);
      const nhfg = sessions.map((session) => session);
      console.log("Specific date data ---->", JSON.stringify(nhfg));
      setAPIdata(sessionIds);
    } catch (error) {
      console.error("Error fetching cobrowse data:", error);
    }
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (toDate && fromDate) {
      finalDate(fromDate, toDate);
    } else {
      console.error("Invalid date format");
    }
  };


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
            <span className="details">TO</span>
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
              <th>S.N</th>
              <th>ID</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((id, index)=>{
                 return (
                      <tr key={index}>
                        <td>
                          {totalSerialNo + index}
                        </td>
                        {/* <td>{date}</td> */}
                        <td>{id}</td>
                      </tr>
                    )
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
