import React from 'react';
import './style.css';
import DateWiseTable from '../../Chart/Components/DateWiseReports/DateWiseTable';
import DurationChart from '../../Chart/Components/Duration/DurationChart';
import SessionChart2 from '../../Chart/Components/Duration/SessionChart2';
import MonthSessionsChart from '../../Chart/Components/MonthWiseReport/MonthSessionsChart';
import MonthWiseTable from '../../Chart/Components/MonthWiseReport/MonthWiseTable';
import WidgetApiProvider from '../../contexts/WidgetApiContext';

const CobrowseReports = ({ interactionId }) => {
    return (
        <WidgetApiProvider interactionId={interactionId}>
            <div className='cobrowse-reports-widget-container'>
                <SessionChart2 />
                <DurationChart />
                <DateWiseTable />
                <MonthSessionsChart />
                <MonthWiseTable />
            </div>
        </WidgetApiProvider>
    );
};

export default CobrowseReports;
