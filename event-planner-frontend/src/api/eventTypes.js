import axios from './axios';
import { toast } from 'sonner';
import { handleError } from './handleError';

export const getAllEventTypes = async (search = '') => {
  try {
    const res = await axios.get('/eventTypes', {
      params: search ? { search } : {},
    });
    return res.data?.data || [];
  } catch (err) {
    handleError(err);
    toast.error('Failed to load event types');
    return [];
  }
};

export const addEventType = async (type) => {
  try {
    const res = await axios.post('/eventTypes', { type });
    return res.data?.data;
  } catch (err) {
    handleError(err);
    toast.error('Failed to add event type');
    return null;
  }
};

export const deleteEventType = async (type) => {
  try {
    const res = await axios.delete('/eventTypes', {
      data: { type },
    });
    return res.data?.data;
  } catch (err) {
    handleError(err);
    toast.error('Failed to delete event type');
    return null;
  }
};
