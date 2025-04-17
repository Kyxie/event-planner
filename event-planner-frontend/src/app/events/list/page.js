'use client';

import { useState, useEffect } from 'react';
import { getEvents, updateEvent, deleteEvent } from '@/api/events';
import EventHeader from '@/components/event/EventHeader';
import EventCard from '@/components/event/EventCard';
import { toast } from 'sonner';
import EventEmpty from '@/components/event/EventEmpty';

export default function EventListPage() {
  const [events, setEvents] = useState([]);
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    return {
      startDate: new Date(today.getFullYear(), today.getMonth(), 1),
      endDate: new Date(today.getFullYear(), today.getMonth() + 1, 0),
    };
  });

  useEffect(() => {
    if (!dateRange.startDate || !dateRange.endDate) return;

    getEvents(dateRange.startDate, dateRange.endDate)
      .then(setEvents)
      .catch((err) => {
        console.error('Failed to load events:', err);
        toast.error('Failed to load event');
      });
  }, [dateRange]);

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      fetchEvents();
      toast.success('Event delete successfully');
    } catch (err) {
      console.error('Failed to delete event:', err);
      toast.error('Failed to delete event');
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await updateEvent(id, updatedData);
      fetchEvents();
      toast.success('Event update successfully');
    } catch (err) {
      console.error('Failed to update event:', err);
      toast.error('Failed to update event');
    }
  };

  const fetchEvents = async () => {
    try {
      const data = await getEvents(dateRange.startDate, dateRange.endDate);
      setEvents(data);
    } catch (err) {
      console.error('Failed to load event:', err);
      toast.error('Failed to load event');
    }
  };

  const handleSave = () => {
    fetchEvents();
  };

  return (
    <div>
      <EventHeader
        dateRange={dateRange}
        setDateRange={setDateRange}
        onSave={handleSave}
        setEvents={setEvents}
        view="list"
      />

      {events.length === 0 ? (
        <EventEmpty />
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event._id}>
              <EventCard
                event={event}
                onSave={handleSave}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
