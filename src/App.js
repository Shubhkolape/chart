import "./App.css";

import DateWiseTable from "./Chart/Components/DateWiseReports/DateWiseTable";
import DurationChart from "./Chart/Components/Duration/DurationChart";
import SessionChart2 from "./Chart/Components/Duration/SessionChart2";
import MonthSessionsChart from "./Chart/Components/MonthWiseReport/MonthSessionsChart";
import MonthWiseTable from "./Chart/Components/MonthWiseReport/MonthWiseTable";

function App() {
  return (
    <div className="App">
      <SessionChart2 />
      <DurationChart />
      <DateWiseTable />
      <MonthSessionsChart />
      <MonthWiseTable />
    </div>
  );
}

export default App;
