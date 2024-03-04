import React, { useState } from 'react';
import ChartForDailySessionCountDate from './DateWiseReports/ChartForDailySessionCountDate';
import DateWiseTablecopy from './DateWiseReports/DateWiseTablecopy';


function CustomTabs({ initialTab, children }) {
  const [activeTab, setActiveTab] = useState(initialTab || 0);

  const handleChange = (index) => {
    setActiveTab(index);
  };

  return (
    <div>
      <div className="tabs">
        {React.Children.map(children, (child, index) => {
          if (child.type.name === 'CustomTab') {
            return React.cloneElement(child, {
              isActive: activeTab === index,
              onClick: () => handleChange(index),
            });
          }
        })}
      </div>
      {React.Children.map(children, (child, index) => {
        if (child.type.name === 'CustomTabPanel' && index === activeTab) {
          return child;
        }
      })}
    </div>
  );
}

function CustomTab({ label, isActive, onClick }) {
  return (
    <button className={`tab-button ${isActive ? 'active' : ''}`} onClick={onClick}>
      {label}
    </button>
  );
}

function CustomTabPanel({ children }) {
  return <div className="tab-panel">{children}</div>;
}

export { CustomTab, CustomTabPanel, CustomTabs };



<CustomTabs initialTab={0}>
  <CustomTab label="Day Count" />
  <CustomTab label="Month Count" />
  
  <CustomTabPanel>
  <ChartForDailySessionCountDate/>
  </CustomTabPanel>

  <CustomTabPanel>
  <DateWiseTablecopy/>
  </CustomTabPanel>
</CustomTabs>
