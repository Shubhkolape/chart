import AllAgentsDailyChart from '../AllChartComponents/AllAgentsDailyChart';
import AllAgentsMonthlyChart from '../AllChartComponents/AllAgentsMonthlyChart';
import DaySummaryChart from '../AllChartComponents/DaySummaryChart';
import MonthSummaryChart from '../AllChartComponents/MonthSummaryChart';
import SessionDurationChart from '../AllChartComponents/SessionDurationChart';
import AllAgentDailyTable from '../AllTableComponents/AllAgentDailyTable';
import AllAgentMonthlyTable from '../AllTableComponents/AllAgentMonthlyTable';
import DaySummaryTable from '../AllTableComponents/DaySummaryTable';
import MonthSummaryTable from '../AllTableComponents/MonthSummaryTable';
import SessionDurationTable from '../AllTableComponents/SessionDurationTable';
import LicenseInfo from '../Licenses/LicenseInfo';


export const TabContent = ({
    activeMainTab,
    activeSubTab,
    startDate,
    endDate,
    handleStartDateChange,
    handleEndDateChange,
}) => {
    switch (activeMainTab) {
        case 'day_summary':
            return activeSubTab === 'chart' ? (
                <DaySummaryChart
                    startDate={startDate}
                    endDate={endDate}
                    handleStartDateChange={handleStartDateChange}
                    handleEndDateChange={handleEndDateChange}
                />
            ) : (
                <DaySummaryTable
                    startDate={startDate}
                    endDate={endDate}
                    handleStartDateChange={handleStartDateChange}
                    handleEndDateChange={handleEndDateChange}
                />
            );
        case 'month_summary':
            return activeSubTab === 'chart' ? (
                <MonthSummaryChart
                    startDate={startDate}
                    endDate={endDate}
                    handleStartDateChange={handleStartDateChange}
                    handleEndDateChange={handleEndDateChange}
                />
            ) : (
                <MonthSummaryTable
                    startDate={startDate}
                    endDate={endDate}
                    handleStartDateChange={handleStartDateChange}
                    handleEndDateChange={handleEndDateChange}
                />
            );
        case 'duration':
            return activeSubTab === 'chart' ? (
                <SessionDurationChart
                    startDate={startDate}
                    endDate={endDate}
                    handleStartDateChange={handleStartDateChange}
                    handleEndDateChange={handleEndDateChange}
                />
            ) : (
                <SessionDurationTable
                    startDate={startDate}
                    endDate={endDate}
                    handleStartDateChange={handleStartDateChange}
                    handleEndDateChange={handleEndDateChange}
                />
            );
        case 'agent_session':
            return activeSubTab === 'chart' ? (
                <AllAgentsMonthlyChart
                    startDate={startDate}
                    endDate={endDate}
                    handleStartDateChange={handleStartDateChange}
                    handleEndDateChange={handleEndDateChange}
                />
            ) : (
                <AllAgentMonthlyTable
                    startDate={startDate}
                    endDate={endDate}
                    handleStartDateChange={handleStartDateChange}
                    handleEndDateChange={handleEndDateChange}
                />
            );
        case 'day_details':
            return activeSubTab === 'chart' ? (
                <AllAgentsDailyChart
                    startDate={startDate}
                    endDate={endDate}
                    handleStartDateChange={handleStartDateChange}
                    handleEndDateChange={handleEndDateChange}
                />
            ) : (
                <AllAgentDailyTable
                    startDate={startDate}
                    endDate={endDate}
                    handleStartDateChange={handleStartDateChange}
                    handleEndDateChange={handleEndDateChange}
                />
            );
        case 'licenses_details':
            return activeSubTab === 'table' ? (
                <LicenseInfo
                    startDate={startDate}
                    endDate={endDate}
                    handleStartDateChange={handleStartDateChange}
                    handleEndDateChange={handleEndDateChange}
                />
            ) : null;
        default:
            return null;
    }
};
