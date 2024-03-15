import '@avaya/neo-react/avaya-neo-react.css';
import React, { useState } from 'react';
import AverageDurationAllAgent from './AllAgents/AverageDurationAllAgent';
import DailyChartAllAgent from './AllAgents/DailyChartAllAgent';
import MonthlyChartAllAgent from './AllAgents/MonthlyChartAllAgent';
import SessionDurationAllAgent from './AllAgents/SessionDurationAllAgent';
import DateWiseTable from './DateWiseReports/DateWiseTable';
import License from './License/License';
import MonthWiseTable from './MonthWiseReport/MonthWiseTable';
import MultiAgentDailyChart2 from './MultipleAgent/MultiAgentDailyChart2';
import MultiAgentDailyTable from './MultipleAgent/MultiAgentDailyTable';
import MultiAgentMonthTable from './MultipleAgent/MultiAgentMonthTable';
import MultiAgentMonthlyChart2 from './MultipleAgent/MultiAgentMonthlyChart2';

const Tabs = () => {
    const [activeMainTab, setActiveMainTab] = useState('day_summary');
    const [activeSubTab, setActiveSubTab] = useState('chart');

    const mainTabs = [
        { id: 'day_summary', label: 'DAY SUMMARY', subTabs: ['chart', 'table'] },
        { id: 'month_summary', label: 'MONTH SUMMARY', subTabs: ['chart', 'table'] },
        { id: 'duration', label: 'DURATION', subTabs: ['chart', 'table'] },
        { id: 'licenses', label: 'LICENSES', subTabs: ['table'] },
        { id: 'agent_session', label: 'AGENT SESSION', subTabs: ['chart', 'table'] },
        { id: 'day_details', label: 'DAY SESSION', subTabs: ['chart', 'table'] },
    ];

    const handleMainTabClick = (tabId) => {
        setActiveMainTab(tabId);
        if (tabId === 'licenses') {
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
                       >{tab.label}</div>
                ))}
            </div>
            <div className='sub-tabs'>
                {mainTabs.find(tab => tab.id === activeMainTab).subTabs.map(subTab => (
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
                    <DailyChartAllAgent />
                )}
                {activeMainTab === 'day_summary' && activeSubTab === 'table' && (
                    <DateWiseTable />
                )}

                {activeMainTab === 'month_summary' && activeSubTab === 'chart' && (
                    <MonthlyChartAllAgent />
                )}
                {activeMainTab === 'month_summary' && activeSubTab === 'table' && (
                    <MonthWiseTable />
                )}

                {activeMainTab === 'duration' && activeSubTab === 'chart' && (
                    <SessionDurationAllAgent />
                )}
                {activeMainTab === 'duration' && activeSubTab === 'table' && (
                    <AverageDurationAllAgent />
                )}

                {activeMainTab === 'licenses' && activeSubTab === 'table' && <License />}

                {activeMainTab === 'agent_session' && activeSubTab === 'chart' && (
                    <MultiAgentMonthlyChart2 />
                )}
                {activeMainTab === 'agent_session' && activeSubTab === 'table' && (
                    <MultiAgentMonthTable />
                )}

                {activeMainTab === 'day_details' && activeSubTab === 'chart' && (
                    <MultiAgentDailyChart2 />
                )}
                {activeMainTab === 'day_details' && activeSubTab === 'table' && (
                    <MultiAgentDailyTable />
                )}
            </div>
        </div>
    );
};

export default Tabs;
