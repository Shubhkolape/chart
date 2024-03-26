import React from 'react';
import ParentComponentTest from '../../Components/Test/ParentComponentTest';
import WidgetApiProvider from '../../contexts/WidgetApiContext';
import './style.css';

const CobrowseReports = ({ interactionId }) => {
    return (
        <WidgetApiProvider interactionId={interactionId}>
            <div className='cobrowse-reports-widget-container'>
                <ParentComponentTest />
            </div>
        </WidgetApiProvider>
    );
};

export default CobrowseReports;
