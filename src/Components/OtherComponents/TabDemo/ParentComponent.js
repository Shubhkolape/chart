import '@avaya/neo-react/avaya-neo-react.css';
import React, { useState } from 'react';
import DailyChartAllAgent from './AllAgents/DailyChartAllAgent';
import MonthlyChartAllAgent from './AllAgents/MonthlyChartAllAgent';
import DateWiseTable from './DateWiseReports/DateWiseTable';
import MonthWiseTable from './MonthWiseReport/MonthWiseTable';

function ParentComponent() {
    const formattedDate = (date) => {
        return date.toISOString().split('T')[0];
    };
    const today = new Date();
    const formatteToday = formattedDate(today);
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    const formattedSixMonthsAgo = formattedDate(sixMonthsAgo);

    const [startDate, setStartDate] = useState(formattedSixMonthsAgo);
    const [endDate, setEndDate] = useState(formatteToday);


    const [startDate1, setStartDate1] = useState(formattedSixMonthsAgo);
    const [endDate1, setEndDate1] = useState(formatteToday);

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    // for tabs

    const [activeMainTab, setActiveMainTab] = useState('day_summary');
    const [activeSubTab, setActiveSubTab] = useState('chart');

    const mainTabs = [
        { id: 'day_summary', label: 'DAY SUMMARY', subTabs: ['chart', 'table'] },
        { id: 'month_summary', label: 'MONTH SUMMARY', subTabs: ['chart', 'table'] },
        { id: 'duration', label: 'DURATION', subTabs: ['chart', 'table'] },
        // { id: 'licenses', label: 'LICENSES', subTabs: ['table'] },
        { id: 'agent_session', label: 'AGENT SESSION', subTabs: ['chart', 'table'] },
        { id: 'day_details', label: 'DAY SESSION', subTabs: ['chart', 'table'] },
        { id: 'licenses_details', label: 'LICENSES DETAILS', subTabs: ['table'] },
    ];

    const handleMainTabClick = (tabId) => {
        setActiveMainTab(tabId);
        if (tabId === 'licenses' || tabId === 'licenses_details') {
            setActiveSubTab('table');
        } else {
            setActiveSubTab('chart');
        }
    };

    const handleSubTabClick = (tabId) => {
        setActiveSubTab(tabId);
    };

    return (
        <div className='tabs-container'>
            <div className='main-tabs'>
                {mainTabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={`tab ${tab.id === activeMainTab ? 'active' : ''}`}
                        onClick={() => handleMainTabClick(tab.id)}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>
            <div className='sub-tabs'>
                {mainTabs
                    .find((tab) => tab.id === activeMainTab)
                    .subTabs.map((subTab) => (
                        <div
                            key={subTab}
                            className={`sub-tab ${subTab === activeSubTab ? 'active' : ''}`}
                            onClick={() => handleSubTabClick(subTab)}
                        >
                            {subTab.charAt(0).toUpperCase() + subTab.slice(1)}
                        </div>
                    ))}
            </div>
            <div className='content'>
                {activeMainTab === 'day_summary' && activeSubTab === 'chart' && (
                    <DailyChartAllAgent 
                    startDate={startDate}
                    endDate={endDate}
                    handleStartDateChange={handleStartDateChange}
                    handleEndDateChange={handleEndDateChange}
                    />
                )}
                {activeMainTab === 'day_summary' && activeSubTab === 'table' && (
                    <DateWiseTable
                        startDate={startDate}
                        endDate={endDate}
                        handleStartDateChange={handleStartDateChange}
                        handleEndDateChange={handleEndDateChange}
                    />
                )}

                
                {activeMainTab === 'month_summary' && activeSubTab === 'chart' && (<MonthlyChartAllAgent
                startDate={startDate1}
                endDate={endDate1}
                handleStartDateChange={handleStartDateChange}
                handleEndDateChange={handleEndDateChange}
                 />)}
                {activeMainTab === 'month_summary' && activeSubTab === 'table' && ( <MonthWiseTable /> )}

                {/* 
                {activeMainTab === 'duration' && activeSubTab === 'chart' && ( <SessionDurationAllAgent />)}
                {activeMainTab === 'duration' && activeSubTab === 'table' && (<AverageDurationAllAgent />)} */}

                {/* {activeMainTab === 'licenses' && activeSubTab === 'table' && <LicenseInfo />} */}

                {/* 
                {activeMainTab === 'agent_session' && activeSubTab === 'chart' && (<MultiAgentMonthlyChart2 />)}
                {activeMainTab === 'agent_session' && activeSubTab === 'table' && (<MultiAgentMonthTable />)} */}

                {/* {activeMainTab === 'day_details' && activeSubTab === 'chart' && ( <MultiAgentDailyChart2 /> )}
                {activeMainTab === 'day_details' && activeSubTab === 'table' && (<MultiAgentDailyTable />)}


                {activeMainTab === 'licenses_details'&& activeSubTab === 'table' &&  <LicenseInfo />} */}
            </div>
        </div>
    );
}

export default ParentComponent;
