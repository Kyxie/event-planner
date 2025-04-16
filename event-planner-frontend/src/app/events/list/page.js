'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import EventDialog from '@/components/event/EventDialog';
import EventCard from '@/components/event/EventCard';
// import ExpandableSearch from '@/components/button/ExpandableSearch';
import ExpandableDatePicker from '@/components/button/ExpandableDateRangePicker';
import { Plus, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { getEvents, addEvent, updateEvent, deleteEvent } from '@/api/events';
import { Input } from '@/components/ui/input';

export default function EventListPage() {
  const [events, setEvents] = useState([]);
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    return {
      from: new Date(today.getFullYear(), today.getMonth(), 1),
      to: new Date(today.getFullYear(), today.getMonth() + 1, 0),
    };
  });

  useEffect(() => {
    getEvents(dateRange.from, dateRange.to)
      .then(setEvents)
      .catch((err) => console.error('Failed to load events:', err));
  }, [dateRange]);

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleSave = async (newEvent) => {
    try {
      let saved;
      if (newEvent.id) {
        // 有 id：更新
        saved = await updateEvent(newEvent.id, newEvent);
      } else {
        // 无 id：添加
        saved = await addEvent(newEvent);
      }

      setEvents((prev) => {
        const exists = prev.find((e) => e.id === saved.id);
        if (exists) {
          return prev.map((e) => (e.id === saved.id ? saved : e));
        }
        return [...prev, saved];
      });
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">List View</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          {/* Search */}
          <Input
            type="text"
            placeholder="Search..."
            onChange={(e) => {
              // Searching logic
            }}
            className="w-[200px]"
          />
          {/* <ExpandableSearch
            onSearch={(value) => {
              console.log('Search...', value)
            }}
          /> */}

          {/* Date Picker */}
          <ExpandableDatePicker dateRange={dateRange} setDateRange={setDateRange} />

          {/* Change view*/}
          <Link href="/events/timeline">
            <Button variant="outline" size="icon">
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </Link>

          {/* Add event */}
          <EventDialog
            mode="add"
            onSave={handleSave}
            trigger={
              <Button size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            }
          />
        </div>
      </div>

      {events.length === 0 ? (
        <p>No events</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event.id}>
              <EventCard event={event} onSave={handleSave} onDelete={handleDelete} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
