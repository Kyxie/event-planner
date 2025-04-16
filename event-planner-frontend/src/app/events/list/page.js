'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import EventDialog from '@/components/event/EventDialog';
import EventCard from '@/components/event/EventCard';
import ExpandableSearch from '@/components/button/ExpandableSearch';
import ExpandableDatePicker from '@/components/button/ExpandableDateRangePicker';
import { Plus, RefreshCcw, Calendar as CalendarIcon } from 'lucide-react';
import Link from 'next/link';

const mockEvents = [
  {
    id: '1',
    title: 'Q1 Earnings Call',
    type: 'Dividends',
    startDate: '2025-04-20',
    endDate: '2025-04-21',
  },
  {
    id: '2',
    title: 'M&A Announcement',
    type: 'Merger',
    startDate: '2025-04-22',
    endDate: '2025-04-25',
  },
];

export default function EventListPage() {
  const [events, setEvents] = useState(mockEvents);
  const [deleteId, setDeleteId] = useState(null);

  const today = new Date();
  const [dateRange, setDateRange] = useState({
    from: new Date(today.getFullYear(), today.getMonth(), 1),
    to: new Date(today.getFullYear(), today.getMonth() + 1, 0),
  });

  const handleDelete = (id) => {
    setEvents(events.filter((event) => event.id !== id));
    setDeleteId(null);
  };

  const handleSave = (newEvent) => {
    setEvents((prev) => {
      const exists = prev.find((e) => e.id === newEvent.id);
      if (exists) {
        return prev.map((e) => (e.id === newEvent.id ? newEvent : e));
      }
      return [...prev, newEvent];
    });
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">List View</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          {/* Search */}
          {/* <Input
            type="text"
            placeholder="Search..."
            onChange={(e) => {
              // Searching logic
            }}
            className="w-[200px]"
          /> */}
          <ExpandableSearch
            onSearch={(value) => {
              console.log('Search...', value)
            }}
          />

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
