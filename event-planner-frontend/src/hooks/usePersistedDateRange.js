import { useEffect, useState } from 'react';
import { loadStoredDateRange, saveDateRange } from '@/utils/dateRangeStorage';

export default function useClientDateRange() {
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    const stored = loadStoredDateRange();
    if (stored) {
      setDateRange(stored);
    } else {
      const today = new Date();
      setDateRange({
        startDate: new Date(today.getFullYear(), today.getMonth(), 1),
        endDate: new Date(today.getFullYear(), today.getMonth() + 1, 0),
      });
    }
  }, []);

  const updateDateRange = (range) => {
    setDateRange(range);
    saveDateRange(range);
  };

  return [dateRange, updateDateRange];
}
