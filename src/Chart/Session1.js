import CobrowseAPI from "cobrowse-agent-sdk";
import React, { useEffect, useState } from "react";
import config from "../utils/config";
// import data1 from '../data1'

function Session1() {
  const [APIdata, setAPIdata] = useState([]);

  // fetching data from the Cobrowse API 👇
  useEffect(() => {
    let today = new Date();
    const fetchData = async () => {
      const agentToken = config.agentToken;
      const cobrowse = new CobrowseAPI(agentToken);
      try {
        // let data = await cobrowse.sessions.list({ filter_user_id: "12345" });
        let data = await cobrowse.sessions.list({
          //   activated_after: "2024-02-08",
          //   activated_after: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate() - 10}`,
          limit: 10000,
        });

        // ("filter_user_id"='12345');
        let maindata = data;
        console.log("fu===============> ", JSON.stringify(data));
        setAPIdata(maindata);
      } catch (error) {
        console.error("Error fetching cobrowse data:", error);
      }
    };
    fetchData();
  }, []);

  //   console.log("main data ", typeof APIdata);

  const Arraydata = APIdata.map((obj) => obj.created);
  const createdArray = Arraydata.map((number) => number.toString());
  //   console.log("createdArray", createdArray);

  return (
    <div>
      <h2>Agent Session Handled Data</h2>
    </div>
  );
}

export default Session1;
