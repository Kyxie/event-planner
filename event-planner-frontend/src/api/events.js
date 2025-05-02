import axios from './axios';
import { toast } from 'sonner';
import { handleError } from './handleError';

export const getEvents = async (start, end, filters = {}) => {
  try {
    if (!(start instanceof Date) || !(end instanceof Date)) {
      throw new Error('Invalid date range');
    }

    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];

    const res = await axios.get('/events', {
      params: {
        startDate: startStr,
        endDate: endStr,
        ...filters,
      },
    });

    return res.data?.data;
  } catch (err) {
    handleError(err);
    toast.error('Failed to send get request');
  }
};

export const addEvent = async (event) => {
  try {
    const res = await axios.post('/events', event);
    return res.data?.data;
  } catch (err) {
    handleError(err);
    toast.error('Failed to send add request');
  }
};

export const updateEvent = async (id, event) => {
  try {
    const res = await axios.put(`/events/${id}`, event);
    return res.data?.data;
  } catch (err) {
    handleError(err);
    toast.error('Failed to send put request');
  }
};

export const deleteEvent = async (id) => {
  try {
    const res = await axios.delete(`/events/${id}`);
    return res.data?.data;
  } catch (err) {
    handleError(err);
    toast.error('Failed to send delete request');
  }
};

export const reorderEvents = async (draggedId, beforeId, afterId) => {
  try {
    // Request structure
    const requestBody = {
      draggedId,
      beforeId,
      afterId
    };

    const res = await axios.post('/events/reorder', requestBody);
    toast.success('Events order saved');
    return res.data;
  } catch (err) {
    handleError(err);
    toast.error('Failed to reorder events');
    throw err;
  }
};

export const resetEventOrder = async () => {
  try {
    const res = await axios.post('/events/resetOrder');
    return res.data;
  } catch (err) {
    console.error(err);
    toast.error('Failed to reset order');
    throw err;
  }
};
