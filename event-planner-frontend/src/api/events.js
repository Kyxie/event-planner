import axios from './axios';

export const getEvents = async (start, end) => {
  const startStr = start.toISOString().split('T')[0];
  const endStr = end.toISOString().split('T')[0];
  const res = await axios.get('/events', {
    params: { start: startStr, end: endStr },
  });
  return res.data.data;
};

export const addEvent = async (event) => {
  const res = await axios.post('/events', event);
  return res.data.data;
};

export const updateEvent = async (id, event) => {
  const res = await axios.put(`/events/${id}`, event);
  return res.data.data;
};

export const deleteEvent = async (id) => {
  const res = await axios.delete(`/events/${id}`);
  return res.data.data;
};
