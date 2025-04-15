'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EventDialog from '@/components/event/dialog';
import EventCard from '@/components/event/card';
import { Plus, RefreshCcw } from 'lucide-react';
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
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">List View</h2>
        <div className="flex items-center gap-2">
          {/* Search */}
          <Input
            type="text"
            placeholder="Search..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-[200px]"
          />

          {/* Change view */}
          <Link href="/events/timeline">
            <Button variant="outline" size="icon">
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </Link>

          {/* Adding events */}
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
