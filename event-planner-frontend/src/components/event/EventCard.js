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
import EventDialog from './EventDialog';
import { format } from 'date-fns';

export default function EventCard({ event, onSave, onDelete, onUpdate }) {
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-gray-300 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{event.title}</h3>
          <p>
            {format(new Date(event.start), 'MMMM do, yyyy')} —{' '}
            {format(new Date(event.end), 'MMMM do, yyyy')}
          </p>
          <p className="text-muted-foreground text-sm">{event.type}</p>
        </div>

        <div className="flex gap-2">
          {/* Edit */}
          <EventDialog
            mode="edit"
            event={event}
            onSave={(updatedData) => onUpdate(event._id, updatedData)}
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
                    onDelete(event._id);
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
