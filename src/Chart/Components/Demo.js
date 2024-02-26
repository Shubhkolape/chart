import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import * as React from 'react';
import AvarageTime from './AvarageTime/AvarageTime';
import ChartForDailySessionCountDate from './DateWiseReports/ChartForDailySessionCountDate';
import DateWiseTable from './DateWiseReports/DateWiseTable';
import DurationChart from './Duration/DurationChart';
import SessionChart2 from './Duration/SessionChart2';
import MonthSessionsChart from './MonthWiseReport/MonthSessionsChart';
import MonthWiseTable from './MonthWiseReport/MonthWiseTable';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role='tabpanel'
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function BasicTabs() {
    const [value, setValue] = React.useState(0);
    const [view, setView] = React.useState('chart'); // State to manage chart or table view

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setView('chart'); // Reset view to chart when switching tabs
    };

    const handleViewChange = (newView) => {
        setView(newView);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
                    <Tab label='Day Count' {...a11yProps(0)} />
                    <Tab label='Month Count' {...a11yProps(1)} />
                    <Tab label='Duration Count' {...a11yProps(2)} />
                    <Tab label='Avarge Duration' {...a11yProps(3)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <div className='tab-button'>
                    <button className='tab-button-1' onClick={() => handleViewChange('chart')}>Chart</button>
                    <button  className='tab-button-1' onClick={() => handleViewChange('table')}>Table</button>
                    {view === 'chart' && <ChartForDailySessionCountDate />}
                    {view === 'table' && <DateWiseTable />}
                </div>
            </CustomTabPanel>

            <CustomTabPanel value={value} index={1}>
            <div className='tab-button'>
                    <button  className='tab-button-1' onClick={() => handleViewChange('chart')}>Chart</button>
                    <button  className='tab-button-1' onClick={() => handleViewChange('table')}>Table</button>
                    {view === 'chart' && <MonthSessionsChart />}
                    {view === 'table' && <MonthWiseTable />}
                </div>
            </CustomTabPanel>

            <CustomTabPanel value={value} index={2}>
            <div className='tab-button'>
                    <button  className='tab-button-1' onClick={() => handleViewChange('chart')}>Chart</button>
                    <button  className='tab-button-1' onClick={() => handleViewChange('table')}>Table</button>
                    {view === 'chart' && <SessionChart2 />}
                    {view === 'table' && <DurationChart />}
                </div>
            </CustomTabPanel>

            <CustomTabPanel value={value} index={3}>
                <div>
                    <AvarageTime />
                </div>
            </CustomTabPanel>
        </Box>
    );
}
