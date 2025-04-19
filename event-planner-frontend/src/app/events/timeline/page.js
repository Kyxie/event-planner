'use client';

import { useCallback, useState, useEffect, useMemo } from 'react';
import { Gantt, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { toast } from 'sonner';

import useClientDateRange from '@/hooks/usePersistedDateRange';
import { getEvents, updateEvent, resetEventOrder } from '@/api/events';
import { getAllEventTypes, addEventType } from '@/api/eventTypes';
import EventHeader from '@/components/event/EventHeader';
import EventEmpty from '@/components/event/EventEmpty';
import TaskListHeader from '@/components/timeline/TaskListHeader';
import TaskListTable from '@/components/timeline/TaskListTable';
import EventDialog from '@/components/event/EventDialog';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export default function TimelinePage() {
  const [events, setEvents] = useState([]);
  const [viewMode, setViewMode] = useState(ViewMode.Week);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useClientDateRange();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventTypes, setEventTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingKeyword, setPendingKeyword] = useState('');

  const fetchEventTypes = async () => {
    const types = await getAllEventTypes();
    setEventTypes(types);
  };

  const handleSave = async (updatedEvent) => {
    try {
      await updateEvent(updatedEvent.id, updatedEvent);
      toast.success('Updated task date');
      await fetchEvents();
    } catch (err) {
      console.error('Failed to update task date:', err);
      toast.error('Failed to update task');
    }
    setDialogOpen(false);
  };

  const rowHeight = 50;

  const fetchEvents = useCallback(async () => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;
    try {
      setLoading(true);
      const res = await getEvents(dateRange.startDate, dateRange.endDate, {
        keyword: searchTerm.trim(),
      });
      setEvents(res);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [dateRange, searchTerm]);

  useEffect(() => {
    fetchEventTypes();
  }, []);
  
  useEffect(() => {
    if (eventTypes.length > 0) {
      fetchEvents();
    }
  }, [eventTypes]);

  const onDateChange = async (task) => {
    try {
      await updateEvent(task.id, {
        start: task.start,
        end: task.end,
      });
      toast.success('Updated task date');
      await fetchEvents();
    } catch (err) {
      console.error('Failed to update task date:', err);
      toast.error('Failed to update task');
    }
  };

  const handleResetOrder = async () => {
    try {
      await resetEventOrder();
      toast.success('Order reset successfully');
      fetchEvents();
    } catch (err) {
      console.error('Failed to reset order:', err);
    }
  };

  const typeColorMap = useMemo(() => {
    const map = {};
    const colorPalette = [
      '#ffb340', // Orange
      '#31de4b', // Green
      '#70d7ff', // Light Blue
      '#409cff', // Blue
      '#ffd426', // Yellow
      '#66d4cf', // Teal
      '#7d7aff', // Indigo
      '#b59469', // Brown
      '#da8fff', // Purple
      '#ff4136', // Red
    ];
    eventTypes.forEach((type, index) => {
      map[type] = colorPalette[index % colorPalette.length];
    });
    return map;
  }, [eventTypes]);

  const tasks = useMemo(() => {
    return events.map((event) => ({
      id: event._id,
      name: event.title,
      title: event.title,
      type: event.type,
      start: new Date(event.start),
      end: new Date(event.end),
      progress: 100,
      styles: {
        progressColor: typeColorMap[event.type] || '#6b7280',
        progressSelectedColor: '#000',
      },
    }));
  }, [events, typeColorMap]);

  const getColumnWidth = (mode) => {
    switch (mode) {
      case ViewMode.Day:
        return 50;
      case ViewMode.Week:
        return 100;
      case ViewMode.Month:
        return 80;
      default:
        return 50;
    }
  };

  if (!dateRange) return null;

  return (
    <div className="space-y-4">
      <EventHeader
        dateRange={dateRange}
        setDateRange={setDateRange}
        onSave={fetchEvents}
        view="timeline"
        resetOrder={handleResetOrder}
        eventTypes={eventTypes}
        refreshEventTypes={fetchEventTypes}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        pendingKeyword={pendingKeyword}
        setPendingKeyword={setPendingKeyword}
      />

      <div className="flex justify-end">
        <Select value={viewMode} onValueChange={(val) => setViewMode(val)}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Select View Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ViewMode.Day}>Day</SelectItem>
            <SelectItem value={ViewMode.Week}>Week</SelectItem>
            <SelectItem value={ViewMode.Month}>Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="rounded-xl border bg-white p-6 text-center text-gray-500 shadow-sm">
          Loading...
        </div>
      ) : events.length === 0 ? (
        <EventEmpty />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <Gantt
            tasks={tasks}
            viewMode={viewMode}
            rowHeight={rowHeight}
            columnWidth={getColumnWidth(viewMode)}
            onDateChange={onDateChange}
            TaskListHeader={() => <TaskListHeader rowHeight={rowHeight} />}
            TaskListTable={({ tasks }) => (
              <TaskListTable
                tasks={tasks}
                rowHeight={rowHeight}
                onClickTask={(task) => {
                  setSelectedEvent(task);
                  setDialogOpen(true);
                }}
              />
            )}
          />
        </div>
      )}

      <EventDialog
        mode="edit"
        event={selectedEvent}
        onSave={handleSave}
        trigger={null}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
