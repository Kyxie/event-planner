'use client';

import { useCallback, useState, useEffect, useMemo } from 'react';
import { Gantt, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { toast } from 'sonner';

import useClientDateRange from '@/hooks/usePersistedDateRange';
import { getEvents, updateEvent, resetEventOrder } from '@/api/events';

import EventHeader from '@/components/event/EventHeader';
import EventEmpty from '@/components/event/EventEmpty';
import TaskListHeader from '@/components/timeline/TaskListHeader';
import TaskListTable from '@/components/timeline/TaskListTable';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

const typeColorMap = {
  Dividends: '#3b82f6',
  Merger: '#10b981',
  Hire: '#f59e0b',
  Default: '#6b7280',
};

export default function TimelinePage() {
  const [events, setEvents] = useState([]);
  const [viewMode, setViewMode] = useState(ViewMode.Week);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useClientDateRange();

  const rowHeight = 50;

  const fetchEvents = useCallback(async () => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;
    try {
      setLoading(true);
      const res = await getEvents(dateRange.startDate, dateRange.endDate);
      setEvents(res);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

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

  const tasks = useMemo(() => {
    return events.map((event) => ({
      id: event._id,
      name: event.title,
      type: 'task',
      start: new Date(event.start),
      end: new Date(event.end),
      progress: 100,
      styles: {
        progressColor: typeColorMap[event.type] || typeColorMap.Default,
        progressSelectedColor: '#000',
      },
    }));
  }, [events]);

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
        setEvents={setEvents}
        view="timeline"
        resetOrder={handleResetOrder}
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
        <div className="rounded-xl border bg-white shadow-sm p-6 text-center text-gray-500">
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
            TaskListTable={({ tasks }) => <TaskListTable tasks={tasks} rowHeight={rowHeight} />}
          />
        </div>
      )}
    </div>
  );
}
