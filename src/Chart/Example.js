import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import CobrowseAPI from "cobrowse-agent-sdk";
import React, { useEffect, useState } from "react";
import config from "../utils/config";

function Example() {
    const itemsPerPage = 10;
    const [activatedAfter, setActivatedAfter] = useState(''); 
    const [activatedBefore, setActivatedBefore] = useState(''); 
    const [filteredDates, setFilteredDates] = useState([])
    const [APIdata, setAPIdata] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0)

    useEffect(()=>{
        const fetchData = async () => {
            const agentToken = config.agentToken;
            const cobrowse = new CobrowseAPI(agentToken);
      
            try {
              // Validate date inputs
              if (!isValidDate(activatedAfter)) {
                throw new Error('Invalid activated_after date');
              }
              if (!isValidDate(activatedBefore)) {
                throw new Error('Invalid activated_before date');
              }
      
              const sessions = await cobrowse.sessions.list({
                activated_after: activatedAfter,
                activated_before: activatedBefore,
                limit: 30,
              });
              const sessionIds = sessions.map(session => session.id);
              const calculatedDates = getDatesBetween(activatedAfter, activatedBefore);
              setFilteredDates(calculatedDates);
              setAPIdata(sessionIds);
              setTotalPages(Math.ceil(sessionIds.length / itemsPerPage));
            } catch (error) {
              console.error("Error fetching cobrowse data:", error);
            }
          };
          fetchData()
    },[activatedAfter, activatedBefore])



    function isValidDate(dateStr) {
        const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
        const parsedDate = Date.parse(dateStr)
        return dateRegex.test(dateStr) && !isNaN(parsedDate) &&
               parsedDate > 0 && parsedDate < Date.now() + 31536000000; 
      }
      



    const handleChange = (event, newPage) => {
        setPage(newPage);
      };
    

  const currentPageData = APIdata.slice((page - 1) * itemsPerPage, page * itemsPerPage);


  function getDatesBetween(startDateStr, endDateStr) {
    if (!isValidDate(startDateStr) || !isValidDate(endDateStr)) {
      throw new Error('Invalid date inputs');
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);


    if (startDate > endDate) {
        throw new Error('Start date must be before or equal to end date');
      }
      const dates = [];

      let currentDate = startDate;
      while (currentDate <= endDate) {
        dates.push(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    
      return dates;
    }

  return (
    <div>
    <div>
    <label htmlFor="activatedAfter">Activated After:</label>
      <input
        type="date"
        id="activatedAfter"
        value={activatedAfter}
        onChange={event => setActivatedAfter(event.target.value)}
      />
      <label htmlFor="activatedBefore">Activated Before:</label>
      <input
        type="date"
        id="activatedBefore"
        value={activatedBefore}
        onChange={event => setActivatedBefore(event.target.value)}
      />
    </div>

    <div>
    <table>
        <thead>
          <tr>
            <th>S.N</th>
            <th>Date</th>
            <th>No of Request Handled</th>
          </tr>
        </thead>
        <tbody>
          <tr></tr>
          <tr></tr>
          {currentPageData.map((id, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{filteredDates[index]}</td>
              {/* ... other columns */}
            </tr>
          ))}
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
  )
}

export default Example

