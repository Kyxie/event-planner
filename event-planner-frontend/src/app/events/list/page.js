'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import EventDialog from '@/components/event/dialog';
import { Plus, RefreshCcw } from 'lucide-react';
import Link from "next/link";

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
      const exists = prev.find(e => e.id === newEvent.id);
      if (exists) {
        return prev.map(e => e.id === newEvent.id ? newEvent : e);
      }
      return [...prev, newEvent];
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
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
              <RefreshCcw className="w-4 h-4" />
            </Button>
          </Link>

          {/* Adding events */}
          <EventDialog
            mode="add"
            onSave={handleSave}
            trigger={
              <Button size="icon">
                <Plus className="w-4 h-4" />
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
            <li key={event.id} className="border p-4 rounded-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{event.title}</h3>
                  <p>{event.startDate} — {event.endDate}</p>
                  <p className="text-sm text-muted-foreground">{event.type}</p>
                </div>
                <div className="flex gap-2">
                  <EventDialog
                    mode="edit"
                    event={event}
                    onSave={handleSave}
                    trigger={<Button variant="outline" size="sm">Edit</Button>}
                  />
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