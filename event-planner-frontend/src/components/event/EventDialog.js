'use client';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import EventForm from './EventForm';
import { useState } from 'react';

export default function EventDialog({
  mode = 'add',
  trigger,
  event = {},
  onSave,
  open: controlledOpen,
  onOpenChange,
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen; 

  const handleSubmit = (data) => {
    onSave(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add Event' : 'Edit Event'}</DialogTitle>
        </DialogHeader>
        <EventForm initialData={event} onSubmit={handleSubmit} />
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
