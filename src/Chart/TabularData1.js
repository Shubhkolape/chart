import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import CobrowseAPI from "cobrowse-agent-sdk";
import React, { useEffect, useState } from "react";
import config from "../utils/config";

function TabularData1() {
  const [apiData, setApiData] = useState([]);
  const [toDate, seToDate] = useState("");
  const [formDate, setFormDate] = useState("");

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const agentToken = config.agentToken;
      const cobrowse = new CobrowseAPI(agentToken);

      const data = await cobrowse.sessions.list({
        // activated_after: toDate,
        // activated_before: formDate,
        limit: 5,
      });

      let sessionJSON = [];
      let count=0
      data.forEach((ele) => {
        count++
        sessionJSON.push(ele.toJSON());
        console.log(count ,'==',ele.toJSON().id);
      });

      setApiData(sessionJSON);
      // console.log(apiData);
      // console.log("API Data", JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching cobrowse data:", error);
    }
  };

  useEffect(() => {
    // console.log("fu",apiData[0].toJSON());
  }, [apiData]);

  const [currentPage, setCurrentPage] = useState(1);

  

  return (
    <div>
      <h1>Agent Data</h1>
      {/* <form onSubmit={handleFormSubmit}>
        <div className="user-details">
          <div className="input-box">
            <span className="details">To</span>
            <input type="date" required onChange={(e)=>{seToDate(e.target.value)}} />
          </div>
          <div className="input-box">
            <span className="details">From</span>
            <input type="date" required onChange={(e)=>{setFormDate(e.target.value)}} />
          </div>
          <div className="button">
            <input type="submit" value="Submit" />
          </div>
        </div>
      </form> */}

      <table>
        <thead>
          <tr>
            <th>S.N</th>
            <th>Date</th>
            <th>No of Request Handled</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    

      <div className='pagination'>
      <Stack spacing={2}>
      <Pagination count={10} color="secondary"  />
  
    </Stack>
      </div>
    </div>
  );
}
export default TabularData1;
 // activated_after: "2024-02-08",
            // activated_before: "2024-02-10",