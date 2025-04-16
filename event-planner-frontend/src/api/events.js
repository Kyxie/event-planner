import axios from './axios';

const handleError = (error) => {
  const message = error.response?.data?.message || error.message || 'Something went wrong';
  throw new Error(message);
};

export const getEvents = async (start, end) => {
  try {
    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];

    const res = await axios.get('/events', {
      params: { startDate: startStr, endDate: endStr },
    });

    return res.data?.data;
  } catch (error) {
    handleError(error);
  }
};

export const addEvent = async (event) => {
  try {
    const res = await axios.post('/events', event);
    return res.data?.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateEvent = async (id, event) => {
  try {
    const res = await axios.put(`/events/${id}`, event);
    return res.data?.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteEvent = async (id) => {
  try {
    const res = await axios.delete(`/events/${id}`);
    return res.data?.data;
  } catch (error) {
    handleError(error);
  }
};
