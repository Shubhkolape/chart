
import { useState } from 'react';
const useDateRangeHook = (initialStartDate, initialEndDate) => {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  return {
    startDate,
    endDate,
    handleStartDateChange,
    handleEndDateChange,
  };
};

export default useDateRangeHook;

