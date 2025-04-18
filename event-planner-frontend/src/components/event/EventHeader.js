'use client';

import { Button } from '@/components/ui/button';
import { Plus, View, RefreshCcw } from 'lucide-react';
import ExpandableDatePicker from '@/components/button/ExpandableDateRangePicker';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import EventDialog from '@/components/event/EventDialog';
import Link from 'next/link';
import { addEvent, getEvents } from '@/api/events';
import { addEventType } from '@/api/eventTypes';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function EventHeader({
  dateRange,
  setDateRange,
  onSave,
  view,
  setEvents,
  resetOrder,
  eventTypes,
  refreshEventTypes,
}) {
  const handleAdd = async (eventData) => {
    try {
      await addEvent(eventData);
      await addEventType(eventData.type);
      await refreshEventTypes();
      toast.success('Event added successfully');
      onSave();
    } catch (err) {
      console.error('Failed to add event:', err);
      toast.error('Failed to add event');
    }
  };

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-2xl font-bold">{view === 'timeline' ? 'Timeline View' : 'List View'}</h2>

      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
        {/* Search */}
        <Input
          type="text"
          placeholder="Search..."
          onChange={(e) => {
            // Searching logic
          }}
          className="w-[220px]"
        />

        <TooltipProvider>
          {/* Date Range Picker */}
          <Tooltip>
            <TooltipTrigger asChild>
              <ExpandableDatePicker
                dateRange={dateRange}
                setDateRange={setDateRange}
                fetchEvents={(start, end) => {
                  getEvents(start, end)
                    .then(setEvents)
                    .catch((err) => {
                      console.error('Failed to fetch:', err);
                      toast.error('Failed to load events');
                    });
                }}
              />
            </TooltipTrigger>
            <TooltipContent>Pick a date range</TooltipContent>
          </Tooltip>

          {/* Reset event order */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={resetOrder}>
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset event order</TooltipContent>
          </Tooltip>

          {/* View change */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={view === 'timeline' ? '/events/list' : '/events/timeline'}>
                <Button variant="outline" size="icon">
                  <View className="h-4 w-4" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Change view</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Add event */}
        <EventDialog
          mode="add"
          onSave={handleAdd}
          eventTypes={eventTypes}
          refreshEventTypes={refreshEventTypes}
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
