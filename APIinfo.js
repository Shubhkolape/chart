// list(query?: Record<string, string> | undefined): Promise<Session[]>

// List sessions, optionally filter by query parameters.

// Supported query parameters:

// filter_XXX - where XXX is replaced by your customData field names. e.g. filter_user_id=abc would filter devices with customData = { user_id: 'abc' }

// activated_before - only include sessions that were activated before this date. Useful for paging.

// activated_after - only include devices that were activated after this date. Useful for paging.

// agent - Administrator may set this to all to list sessions for all agents. Agent roles may only list their own sessions.

// state - Filter by session that are in one of the supported states: pending, authorizing, active, ended.



  //   activated_after: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate() - 10}`,
     // let data = await cobrowse.sessions.list({ filter_user_id: "12345" });
        // ("filter_user_id"='12345');


// list(agent='something')
// list(activated_before='something')
// list(activated_after='something')

// "6467482d346e69cb6c48919b"



  // useEffect(() => {
    //   const fetchData = async () => {
    //     const agentToken = config.agentToken;
    //     const cobrowse = new CobrowseAPI(agentToken);
    //     try {
    //       let data = await cobrowse.sessions.list({
    //         activated_after: "2024-02-08",
    //         activated_before: "2024-02-10",
    //         limit: 10000,
    //       });
    //       console.log("API Data", JSON.stringify(data));
    //       // setAPIdata(maindata);
    //     } catch (error) {
    //       console.error("Error fetching cobrowse data:", error);
    //     }
    //   };
    //   fetchData();
    // }, []);



//     {groupedData.map((item) => (
//       <tr key={item.date}>
//           <td>{item.serialNo}</td>
//           <td>{item.date}</td>
//           <td>{item.numberOfRequests}</td>
//       </tr>
//   ))}

// const groupedData = formattedData.reduce((acc, item) => {
//    const existingGroup = acc.find(group => group.date === item.date);
//    if (existingGroup) {
//        existingGroup.numberOfRequests++;
//    } else {
//        acc.push(item);
//    }
//    return acc;
// }, []);

   // const formattedData = apiData.map((item, index) => ({
      //   serialNo: index + 1,
      //   // date: item.date,
      //   // numberOfRequests: 0, 
      // }));



            //  let data = await cobrowse.sessions.list({
      //       limit: 50,
      //     });
      //     let sessionJSON = [];
      //     let count=0
      //   let abcd =   data.forEach((ele) => {
      //       count++
      //       sessionJSON.push(ele.toJSON().id);
      //       console.log(count ,'==',ele.toJSON().id);
      //     });
      //     setAPIdata(abcd)
      //     console.log("APIdata ----> ", APIdata);