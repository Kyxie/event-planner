'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Pencil, Trash2 } from 'lucide-react';
import EventDialog from './dialog';

export default function EventCard({ event, onSave, onDelete }) {
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{event.title}</h3>
          <p>
            {event.startDate} — {event.endDate}
          </p>
          <p className="text-muted-foreground text-sm">{event.type}</p>
        </div>

        <div className="flex gap-2">
          {/* Edit */}
          <EventDialog
            mode="edit"
            event={event}
            onSave={onSave}
            trigger={
              <Button size="icon" variant="outline">
                <Pencil className="h-4 w-4" />
              </Button>
            }
          />

          {/* Confirm to delete */}
          <Dialog open={openDelete} onOpenChange={setOpenDelete}>
            <DialogTrigger asChild>
              <Button size="icon" variant="destructive" onClick={() => setOpenDelete(true)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
              </DialogHeader>
              <p>This action cannot be undone. The event will be permanently deleted.</p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenDelete(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onDelete(event.id);
                    setOpenDelete(false);
                  }}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
