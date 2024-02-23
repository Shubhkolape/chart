import React, { createContext, useContext, useEffect, useState } from 'react';

// interface WidgetApiContextProps {
//     children: React.ReactNode;
//     interactionId: any;
// }

// interface WidgetApiContextType {
//     widgetApi: any;
//     interactionId: any;
//     apiInteractionData: any;
// }

const WidgetApiContext = createContext(undefined);

// const WidgetApiProvider: React.FC<WidgetApiContextProps> = ({ children, interactionId }) => {
const WidgetApiProvider = ({ children, interactionId }) => {
    const [widgetApi, setWidgetApi] = useState(null);
    const [apiInteractionData, setApiInteractionData] = useState(null);
    useEffect(() => {
        // const api = (window as any).widgetApi;
        const api = (window)?.WS?.widgetAPI(interactionId);
        // const interactionId = element.nativeElement.getAttribute('interactionid');

        setWidgetApi(api);
        let interactionData = api?.getInteractionData();
        if (interactionData) setApiInteractionData(interactionData);
    }, []);

    return (
        <WidgetApiContext.Provider value={{ widgetApi, interactionId, apiInteractionData }}>
            {children}
        </WidgetApiContext.Provider>
    );
};

export const useWidgetApi = () => {
    const context = useContext(WidgetApiContext);
    if (!context) throw new Error('UseWidgetApi must be used within a WidgetApiProvider');

    return context;
};

export default WidgetApiProvider;
