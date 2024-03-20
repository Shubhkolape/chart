import React from 'react';
import CustomTab from '../../Components/CustomTab';
import WidgetApiProvider from '../../contexts/WidgetApiContext';
import './style.css';

const CobrowseReports = ({ interactionId }) => {
    return (
        <WidgetApiProvider interactionId={interactionId}>
            <div className='cobrowse-reports-widget-container'>
                {/* <Demo /> */}
                <CustomTab />
            </div>
        </WidgetApiProvider>
    );
};

export default CobrowseReports;
