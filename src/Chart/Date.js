
import CobrowseAPI from "cobrowse-agent-sdk";
import React, { useState } from "react";
import config from "../utils/config";


function Date() {


    const [toDate, seToDate] = useState("");
    const [formDate, setFormDate] = useState("");


    const handleFormSubmit = async (event)=>{
    event.preventDefault();
    try {
        const agentToken = config.agentToken;
        const cobrowse = new CobrowseAPI(agentToken);

        const data = await cobrowse.sessions.list({
          activated_after: toDate,
          activated_before: formDate,
          limit: 10000,
        });
      } catch (error) {
        console.error("Error fetching cobrowse data:", error);
      }
    }


  return (
    <div>
             <form onSubmit={handleFormSubmit}>
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
      </form>
    </div>
  )
}

export default Date