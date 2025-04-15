'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">List View</h2>
        <Link href="/events/new" passHref>
          <Button>+ Add Event</Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-gray-500">No events available. Click "Add Event" to create one.</div>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event.id} className="bg-white p-4 rounded-xl border shadow-sm">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.type}</p>
                  <p className="text-sm">{event.startDate} — {event.endDate}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <Link href={`/events/${event.id}`} passHref>
                    <Button variant="outline" className="w-[7ch]" size="sm">Edit</Button>
                  </Link>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm" onClick={() => setDeleteId(event.id)}>
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                      </DialogHeader>
                      <p>This action cannot be undone. The event will be permanently deleted.</p>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => handleDelete(deleteId)}>Delete</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
