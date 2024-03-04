import '@avaya/neo-react/avaya-neo-react.css';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import PropTypes from 'prop-types';
import * as React from 'react';
import AvarageTime from './AvarageTime/AvarageTime';
import ChartForDailySessionCountDate from './DateWiseReports/ChartForDailySessionCountDate';
import DateWiseTablecopy from './DateWiseReports/DateWiseTablecopy';
import DurationChart from './Duration/DurationChart';
import SessionChart2 from './Duration/SessionChart2';
import License from './License/License';
import MonthSessionsChart from './MonthWiseReport/MonthSessionsChart';
import MonthWiseTable from './MonthWiseReport/MonthWiseTable';
import MultiAgentDailyChart2 from './MultipleAgent/MultiAgentDailyChart2';
import MultiAgentDailyTable from './MultipleAgent/MultiAgentDailyTable';
import MultiAgentMonthTable from './MultipleAgent/MultiAgentMonthTable';
import MultiAgentMonthlyChart2 from './MultipleAgent/MultiAgentMonthlyChart2';


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
                <Box sx={{ p: 6 }}>
                    {/* <Typography> */}
                    {children}
                    {/* </Typography> */}
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
    const [view, setView] = React.useState('chart');


    const handleChange = (event, newValue, buttonId) => {
        setValue(newValue);
        setView('chart');
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
                    <Tab label='Average Duration' {...a11yProps(3)} />
                    <Tab label='License Information' {...a11yProps(4)} />
                    <Tab label='Multiple Agents Info' {...a11yProps(5)} />
                    <Tab label='Multiple Agents daily Info' {...a11yProps(6)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <div className='tab-button'>
                    <button
                        className={`tab-button-1 ${view === 'chart' ? 'active' : ''}`}
                        onClick={() => handleViewChange('chart')}
                    >
                        Chart
                    </button>
                    <button
                        className={`tab-button-1 ${view === 'table' ? 'active' : ''}`}
                        onClick={() => handleViewChange('table')}
                    >
                        Table
                    </button>
                    {view === 'chart' && <ChartForDailySessionCountDate  />}
                    {view === 'table' && <DateWiseTablecopy />}
                </div>
            </CustomTabPanel>

            <CustomTabPanel value={value} index={1}>
                <div className='tab-button'>
                <button
                        className={`tab-button-1 ${view === 'chart' ? 'active' : ''}`}
                        onClick={() => handleViewChange('chart')}
                    >
                        Chart
                    </button>
                    <button
                        className={`tab-button-1 ${view === 'table' ? 'active' : ''}`}
                        onClick={() => handleViewChange('table')}
                    >
                        Table
                    </button>
                    {view === 'chart' && <MonthSessionsChart />}
                    {view === 'table' && <MonthWiseTable />}
                </div>
            </CustomTabPanel>

            <CustomTabPanel value={value} index={2}>
                <div className='tab-button'>
                <button
                        className={`tab-button-1 ${view === 'chart' ? 'active' : ''}`}
                        onClick={() => handleViewChange('chart')}
                    >
                        Chart
                    </button>
                    <button
                        className={`tab-button-1 ${view === 'table' ? 'active' : ''}`}
                        onClick={() => handleViewChange('table')}
                    >
                        Table
                    </button>
                    {view === 'chart' && <SessionChart2 />}
                    {view === 'table' && <DurationChart />}
                </div>
            </CustomTabPanel>

            <CustomTabPanel value={value} index={3}>
                <div>
                    <AvarageTime />
                </div>
            </CustomTabPanel>

            <CustomTabPanel value={value} index={4}>
                <div>
                    <License />
                </div>
            </CustomTabPanel>

            <CustomTabPanel value={value} index={5}>
            <div className='tab-button'>
                <button
                        className={`tab-button-1 ${view === 'chart' ? 'active' : ''}`}
                        onClick={() => handleViewChange('chart')}
                    >
                        Chart
                    </button>
                    <button
                        className={`tab-button-1 ${view === 'table' ? 'active' : ''}`}
                        onClick={() => handleViewChange('table')}
                    >
                        Table
                    </button>
                    {view === 'chart' && <MultiAgentMonthlyChart2 />}
                    {view === 'table' && <MultiAgentMonthTable />}
                </div>
            </CustomTabPanel>

            <CustomTabPanel value={value} index={6}>
            <div className='tab-button'>
                <button
                        className={`tab-button-1 ${view === 'chart' ? 'active' : ''}`}
                        onClick={() => handleViewChange('chart')}
                    >
                        Chart
                    </button>
                    <button
                        className={`tab-button-1 ${view === 'table' ? 'active' : ''}`}
                        onClick={() => handleViewChange('table')}
                    >
                        Table
                    </button>
                    {view === 'chart' && <MultiAgentDailyChart2 />}
                    {view === 'table' && <MultiAgentDailyTable />}
                </div>
            </CustomTabPanel>
        </Box>
    );
}
