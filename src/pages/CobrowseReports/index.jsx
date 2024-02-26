import { StyledEngineProvider } from '@mui/material/styles';
import React from 'react';
import Demo from '../../Chart/Components/Demo';
import WidgetApiProvider from '../../contexts/WidgetApiContext';
import './style.css';

const CobrowseReports = ({ interactionId }) => {
    return (
        <WidgetApiProvider interactionId={interactionId}>
            <div className='cobrowse-reports-widget-container'>
                <StyledEngineProvider injectFirst>
                    <Demo />
                </StyledEngineProvider>
            </div>
        </WidgetApiProvider>
    );
};

export default CobrowseReports;
