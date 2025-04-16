'use client';

import { useState, useEffect } from 'react';
import { getEvents, addEvent, updateEvent, deleteEvent } from '@/api/events';
import EventHeader from '@/components/event/EventHeader';
import EventCard from '@/components/event/EventCard';

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
    getEvents(dateRange.startDate, dateRange.endDate)
      .then(setEvents)
      .catch((err) => console.error('Failed to load events:', err));
  }, [dateRange]);

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      fetchEvents();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await updateEvent(id, updatedData);
      fetchEvents();
    } catch (err) {
      console.error('Update failed:', err);
    }
  }

  const fetchEvents = async () => {
    try {
      const data = await getEvents(dateRange.startDate, dateRange.endDate);
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events:', err);
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
        view="list"
      />

      {events.length === 0 ? (
        <p>No events</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event._id}>
              <EventCard event={event} onSave={handleSave} onDelete={handleDelete} onUpdate={handleUpdate} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
