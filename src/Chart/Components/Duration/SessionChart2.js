import { CategoryScale, Chart as ChartJS, Filler, Legend, LineElement, LinearScale, PointElement, Title, Tooltip, } from "chart.js";
import CobrowseAPI from "cobrowse-agent-sdk";
import React, { useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import config from "../../../utils/config";
ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Filler,Legend);

function SessionChart2() {

  const [Sessions, SetSessions] = useState([]);
  const [toDate, seToDate] = useState("");
  const [fromDate, setFromDate] = useState("");

 

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Agent Session data",
      },
    },
  };


  const today = useMemo(() => new Date(), []);
  const firstDateOfMonth = useMemo(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
    [today]
  );
  // formatToday
  // formatSixtyDaysAgo

  const fetchData = async (startDate, endDate) => {
    const agentToken = config.agentToken;
    const cobrowse = new CobrowseAPI(agentToken);

    try {
      const sessions = await cobrowse.sessions.list({
        activated_after: startDate,
        activated_before: endDate,
        limit: 10000,
      });
      SetSessions(sessions);
      // SetCountdata(sessions);
    
    } catch (error) {
      console.error("Error fetching cobrowse data:", error);
    }
  };



  useEffect(() => {
    fetchData(firstDateOfMonth,today);
  }, [firstDateOfMonth,today]);



  function convertToNormalTime(timestampString) {
    const date = new Date(timestampString);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedHours = hours < 10 ? "0" + hours : hours;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    return formattedHours + ":" + formattedMinutes;
  }


  
  function getTimeDiff(time1, time2, unit) {
    var time1Parts = time1.split(":");
    var time2Parts = time2.split(":");
    var hours1 = parseInt(time1Parts[0]);
    var minutes1 = parseInt(time1Parts[1]);
    var hours2 = parseInt(time2Parts[0]);
    var minutes2 = parseInt(time2Parts[1]);
    var diffMinutes = (hours2 - hours1) * 60 + (minutes2 - minutes1);
    if (unit === "h") {
      return diffMinutes / 60;
    }
    return diffMinutes;
  }

  const createdArray = Sessions.map((obj) => obj.created);
  const endedArray = Sessions.map((obj) => obj.ended);

  var getstartTime = createdArray.map((timestamp) =>
    convertToNormalTime(timestamp)
  );

  var getendTime = endedArray.map((timestamp) =>
    convertToNormalTime(timestamp)
  );

  var diffs = [];
  for (var i = 0; i < getstartTime.length; i++) {
    var startTime = getstartTime[i].replace(".", ":");
    var endTime = getendTime[i].replace(".", ":");
    var diff = getTimeDiff(startTime, endTime, "m");
    diffs.push(diff);
  }

  console.log("diffs ----", diffs);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (fromDate && toDate) {
      fetchData(fromDate, toDate);

    } else {
      console.error("Invalid date format");
    }
  };



  // Generate labels for the X-axis
  const labels = diffs.map((_, index) => `Session ${index + 1}`);

  console.log(labels);

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: "Agent Session Data (In Min)",
        data: diffs,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <div className="Agentdata2">
      <h1>Duration of session </h1>
      <div>
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
                seToDate(e.target.value);
              }}
            />
          </div>
          <div className="button">
            <input type="submit" value="Submit" />
          </div>
        </div>
      </form>
      </div>

      <Line className="timeduration" options={options} data={data} />
    </div>
  );
}

export default SessionChart2;
