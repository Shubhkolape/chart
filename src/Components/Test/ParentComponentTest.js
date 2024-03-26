import '@avaya/neo-react/avaya-neo-react.css';
import React, { useState } from 'react';
import { TabContent } from './TabContent';
import useDateRangeHook from './useDateRangeHook';

function ParentComponent() {
    const formattedDate = (date) => {
        return date.toISOString().split('T')[0];
    };
    const today = new Date();
    const formattedToday = formattedDate(today);
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    const formattedSixMonthsAgo = formattedDate(sixMonthsAgo);

    const {
        startDate: startDate1,
        endDate: endDate1,
        handleStartDateChange: handleStartDateChange1,
        handleEndDateChange: handleEndDateChange1,
    } = useDateRangeHook(formattedSixMonthsAgo, formattedToday);

    const {
        startDate: startDate2,
        endDate: endDate2,
        handleStartDateChange: handleStartDateChange2,
        handleEndDateChange: handleEndDateChange2,
    } = useDateRangeHook(formattedSixMonthsAgo, formattedToday);

    const {
        startDate: startDate3,
        endDate: endDate3,
        handleStartDateChange: handleStartDateChange3,
        handleEndDateChange: handleEndDateChange3,
    } = useDateRangeHook(formattedSixMonthsAgo, formattedToday);

    const {
        startDate: startDate4,
        endDate: endDate4,
        handleStartDateChange: handleStartDateChange4,
        handleEndDateChange: handleEndDateChange4,
    } = useDateRangeHook(formattedSixMonthsAgo, formattedToday);
    const {
        startDate: startDate5,
        endDate: endDate5,
        handleStartDateChange: handleStartDateChange5,
        handleEndDateChange: handleEndDateChange5,
    } = useDateRangeHook(formattedSixMonthsAgo, formattedToday);

    const {
        startDate: startDate6,
        endDate: endDate6,
        handleStartDateChange: handleStartDateChange6,
        handleEndDateChange: handleEndDateChange6,
    } = useDateRangeHook(formattedSixMonthsAgo, formattedToday);

    const [activeMainTab, setActiveMainTab] = useState('day_summary');
    const [activeSubTab, setActiveSubTab] = useState('chart');

    const mainTabs = [
        { id: 'day_summary', label: 'DAY SUMMARY', subTabs: ['chart', 'table'] },
        { id: 'month_summary', label: 'MONTH SUMMARY', subTabs: ['chart', 'table'] },
        { id: 'duration', label: 'DURATION', subTabs: ['chart', 'table'] },
        { id: 'agent_session', label: 'AGENT SESSION', subTabs: ['chart', 'table'] },
        { id: 'day_details', label: 'DAY SESSION', subTabs: ['chart', 'table'] },
        { id: 'licenses_details', label: 'LICENSES DETAILS', subTabs: ['table'] },
    ];

    const handleMainTabClick = (tabId) => {
        setActiveMainTab(tabId);
        setActiveSubTab(tabId === 'licenses' || tabId === 'licenses_details' ? 'table' : 'chart');
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
                <TabContent
                    activeMainTab={activeMainTab}
                    activeSubTab={activeSubTab}
                    startDate={
                        activeMainTab === 'day_summary'
                            ? startDate1
                            : activeMainTab === 'month_summary'
                              ? startDate2
                              : activeMainTab === 'duration'
                                ? startDate3
                                : activeMainTab === 'agent_session'
                                  ? startDate4
                                  : activeMainTab === 'day_details'
                                    ? startDate5
                                    : activeMainTab === 'licenses_details'
                                      ? startDate6
                                      : null
                    }
                    endDate={
                        activeMainTab === 'day_summary'
                            ? endDate1
                            : activeMainTab === 'month_summary'
                              ? endDate2
                              : activeMainTab === 'duration'
                                ? endDate3
                                : activeMainTab === 'agent_session'
                                  ? endDate4
                                  : activeMainTab === 'day_details'
                                    ? endDate5
                                    : activeMainTab === 'licenses_details'
                                      ? endDate6
                                      : null
                    }
                    handleStartDateChange={
                        activeMainTab === 'day_summary'
                            ? handleStartDateChange1
                            : activeMainTab === 'month_summary'
                              ? handleStartDateChange2
                              : activeMainTab === 'duration'
                                ? handleStartDateChange3
                                : activeMainTab === 'agent_session'
                                  ? handleStartDateChange4
                                  : activeMainTab === 'day_details'
                                    ? handleStartDateChange5
                                    : activeMainTab === 'licenses_details'
                                      ? handleStartDateChange6
                                      : null
                    }
                    handleEndDateChange={
                        activeMainTab === 'day_summary'
                            ? handleEndDateChange1
                            : activeMainTab === 'month_summary'
                              ? handleEndDateChange2
                              : activeMainTab === 'duration'
                                ? handleEndDateChange3
                                : activeMainTab === 'agent_session'
                                  ? handleEndDateChange4
                                  : activeMainTab === 'day_details'
                                    ? handleEndDateChange5
                                    : activeMainTab === 'licenses_details'
                                      ? handleEndDateChange6
                                      : null
                    }
                />
            </div>
        </div>
    );
}

export default ParentComponent;
