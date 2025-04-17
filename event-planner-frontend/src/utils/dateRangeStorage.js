export const loadStoredDateRange = () => {
  try {
    const stored = localStorage.getItem('eventDateRange');
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    if (!parsed.startDate || !parsed.endDate) return null;

    return {
      startDate: new Date(parsed.startDate),
      endDate: new Date(parsed.endDate),
    };
  } catch (err) {
    console.error('Failed to load dateRange from localStorage', err);
    return null;
  }
};

export const saveDateRange = (dateRange) => {
  try {
    localStorage.setItem('eventDateRange', JSON.stringify(dateRange));
  } catch (err) {
    console.error('Failed to save dateRange to localStorage', err);
  }
};
