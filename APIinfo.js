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

  //  <table>
  //         <thead>
  //           <tr>
  //             <th>SessionNo</th>
  //             <th>Date</th>
  //             <th>Start Time</th>
  //             <th>End Time</th>
  //             <th>App Name</th>
  //             <th>Device Timezone</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {data.map((session, index) => (
  //             <tr key={session.id}>
  //               <td>{generateSessionLabel(index)}</td>

  //               <td>
  //                 {session.toJSON().activated.toISOString().split("T")[0]}
  //               </td>
  //               <td>
  //                 {
  //                   session
  //                     .toJSON()
  //                     .activated.toISOString()
  //                     .split("T")[1]
  //                     .split("Z")[0]
  //                 }
  //               </td>
  //               <td>
  //                 {
  //                   session
  //                     .toJSON()
  //                     .ended.toISOString()
  //                     .split("T")[1]
  //                     .split("Z")[0]
  //                 }
  //               </td>
  //               <td>{session.device.app_name}</td>
  //               <td>{session.device.device_timezone}</td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table> 

  //  <table className=" Duration-table">
  //       <thead>
  //         <tr>
  //           <th>SR</th>
  //           <th>Date</th>
  //           <th>Sessions</th>
  //           <th>Duration (Min)</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {sessions.map((session, index) => (
  //           <tr key={index}>
  //             <td>{index + 1}</td>
  //             <td>{formatDate(session.created)}</td>
  //             <td>{generateSessionLabel(index)}</td>
  //             <td>{calculateDuration(session.created, session.ended)}</td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table> 