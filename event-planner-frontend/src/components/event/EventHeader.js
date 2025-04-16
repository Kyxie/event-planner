'use client';

import { Button } from '@/components/ui/button';
import { Plus, RefreshCcw } from 'lucide-react';
import ExpandableDatePicker from '@/components/button/ExpandableDateRangePicker';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import EventDialog from '@/components/event/EventDialog';
import Link from 'next/link';
import { addEvent } from '@/api/events';

export default function EventHeader({ dateRange, setDateRange, onSave, view }) {
  const handleAdd = async (eventData) => {
    try {
      await addEvent(eventData);
      console.log(eventData)
      toast.success('Event added successfully');
      onSave();
    } catch (err) {
      console.error(err);
      toast.error('Failed to add event');
    }
  };
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-2xl font-bold">{view === 'timeline' ? 'Timeline View' : 'List View'}</h2>

      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
        <Input
          type="text"
          placeholder="Search..."
          onChange={(e) => {
            // Searching logic
          }}
          className="w-[210px]"
        />

        <ExpandableDatePicker dateRange={dateRange} setDateRange={setDateRange} />

        {/* View change */}
        <Link href={view === 'timeline' ? '/events/list' : '/events/timeline'}>
          <Button variant="outline" size="icon">
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </Link>

        {/* Add event */}
        <EventDialog
          mode="add"
          onSave={handleAdd}
          trigger={
            <Button size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          }
        />
      </div>
    </div>
  );
}
