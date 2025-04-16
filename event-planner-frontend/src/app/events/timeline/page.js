'use client';

import { useState } from 'react';
import EventHeader from '@/components/event/EventHeader';
import { Gantt, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import '@/styles/timeline.css';

const typeColorMap = {
  Dividends: '#3b82f6',
  Merger: '#10b981',
  Hire: '#f59e0b',
  Default: '#6b7280',
};

const initialEvents = [
  {
    id: '1',
    title: 'Q1 Earnings Call',
    type: 'Dividends',
    startDate: '2025-04-10',
    endDate: '2025-04-11',
  },
  {
    id: '2',
    title: 'M&A Announcement',
    type: 'Merger',
    startDate: '2025-04-12',
    endDate: '2025-04-15',
  },
  {
    id: '3',
    title: 'New CTO Hired',
    type: 'Hire',
    startDate: '2025-04-16',
    endDate: '2025-04-17',
  },
];

export default function TimelinePage() {
  const [events, setEvents] = useState(initialEvents);
  const [dateRange, setDateRange] = useState({
    from: new Date(2025, 3, 1),
    to: new Date(2025, 3, 30),
  });

  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'Default',
    startDate: '',
    endDate: '',
  });

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.startDate || !newEvent.endDate) return;

    const id = (events.length + 1).toString();
    setEvents([...events, { id, ...newEvent }]);
    setNewEvent({ title: '', type: 'Default', startDate: '', endDate: '' });
  };

  const handleDateChange = (task, newStart, newEnd) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === task.id
          ? {
              ...e,
              startDate: newStart.toISOString().slice(0, 10),
              endDate: newEnd.toISOString().slice(0, 10),
            }
          : e
      )
    );
  };

  const handleSave = (event) => {
    setEvents((prev) => {
      const exists = prev.find((e) => e.id === event.id);
      if (exists) {
        return prev.map((e) => (e.id === event.id ? event : e));
      }
      return [...prev, event];
    });
  };

  // 过滤事件：只显示在 dateRange 范围内的
  const filteredEvents = events.filter((event) => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    return start <= dateRange.to && end >= dateRange.from;
  });

  const tasks = filteredEvents.map((event) => ({
    id: event.id,
    name: event.title,
    type: 'task',
    start: new Date(event.startDate),
    end: new Date(event.endDate),
    progress: 100,
    styles: {
      progressColor: typeColorMap[event.type] || typeColorMap.Default,
      progressSelectedColor: '#000',
    },
  }));

  return (
    <div>
      <EventHeader
        dateRange={dateRange}
        setDateRange={setDateRange}
        onSave={handleSave}
        view="timeline"
      />

      <Gantt
        tasks={tasks}
        viewMode={ViewMode.Day}
        onDateChange={handleDateChange}
        now={new Date()}
      />
    </div>
  );
}
