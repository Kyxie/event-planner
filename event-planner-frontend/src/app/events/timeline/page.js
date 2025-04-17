'use client';

import { useCallback, useState, useEffect } from 'react';
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
  const [dateRange, setDateRange] = useClientDateRange();

  useEffect(() => {
    if (!dateRange) return;
    fetchEvents();
  }, [dateRange]);

  if (!dateRange) return null;

  const fetchEvents = async () => {
    try {
      const res = await getEvents(dateRange.startDate, dateRange.endDate);
      setEvents(res);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      toast.error('Failed to load events');
    }
  };

  const tasks = events.map((event) => ({
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

  const rowHeight = 50;

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

  return (
    <div className="space-y-4">
      <EventHeader
        dateRange={dateRange}
        setDateRange={setDateRange}
        onSave={() => {
          getEvents(dateRange.startDate, dateRange.endDate)
            .then(setEvents)
            .catch((err) => {
              console.error('Failed to reload events:', err);
              toast.error('Failed to reload events');
            });
        }}
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

      {events.length === 0 ? (
        <EventEmpty />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <Gantt
            tasks={tasks}
            viewMode={viewMode}
            rowHeight={rowHeight}
            columnWidth={
              viewMode === 'Day' ? 50 : viewMode === 'Week' ? 100 : viewMode === 'Month' ? 80 : 50
            }
            onDateChange={onDateChange}
            TaskListHeader={() => <TaskListHeader rowHeight={rowHeight} />}
            TaskListTable={({ tasks }) => <TaskListTable tasks={tasks} rowHeight={rowHeight} />}
          />
        </div>
      )}
    </div>
  );
}
