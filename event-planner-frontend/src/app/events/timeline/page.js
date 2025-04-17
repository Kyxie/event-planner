'use client';

import { useState, useEffect } from 'react';
import { Gantt, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { toast } from 'sonner';

import { getEvents, updateEvent } from '@/api/events';
import EventHeader from '@/components/event/EventHeader';
import EventEmpty from '@/components/event/EventEmpty';
import TaskListHeader from '@/components/timeline/TaskListHeader';
import TaskListTable from '@/components/timeline/TaskListTable';

const typeColorMap = {
  Dividends: '#3b82f6',
  Merger: '#10b981',
  Hire: '#f59e0b',
  Default: '#6b7280',
};

export default function TimelinePage() {
  const [events, setEvents] = useState([]);
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    return {
      startDate: new Date(today.getFullYear(), today.getMonth(), 1),
      endDate: new Date(today.getFullYear(), today.getMonth() + 1, 0),
    };
  });

  useEffect(() => {
    if (!dateRange.startDate || !dateRange.endDate) return;

    const fetchEvents = async () => {
      try {
        const res = await getEvents(dateRange.startDate, dateRange.endDate);
        setEvents(res);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        toast.error('Failed to load events');
      }
    };

    fetchEvents();
  }, [dateRange]);

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

  return (
    <div>
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
      />

      {events.length === 0 ? (
        <EventEmpty />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <Gantt
            tasks={tasks}
            viewMode={ViewMode.Day}
            rowHeight={rowHeight}
            listCellWidth="220px"
            TaskListHeader={() => <TaskListHeader rowHeight={rowHeight} />}
            TaskListTable={({ tasks }) => <TaskListTable tasks={tasks} rowHeight={rowHeight} />}
          />
        </div>
      )}
    </div>
  );
}
