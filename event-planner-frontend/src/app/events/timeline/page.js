'use client';

import { useState, useRef } from 'react';
import { Gantt, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import '@/styles/timeline.css';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const typeColorMap = {
  Dividends: '#3b82f6',
  Merger: '#10b981',
  Hire: '#f59e0b',
  Default: '#6b7280',
};

const initialEvents = [
  { id: '1', title: 'Q1 Earnings Call', type: 'Dividends', startDate: '2025-04-10', endDate: '2025-04-11' },
  { id: '2', title: 'M&A Announcement', type: 'Merger', startDate: '2025-04-12', endDate: '2025-04-15' },
  { id: '3', title: 'New CTO Hired', type: 'Hire', startDate: '2025-04-16', endDate: '2025-04-17' },
];

export default function TimelinePage() {
  const [viewMode, setViewMode] = useState(ViewMode.Day);
  const [events, setEvents] = useState(initialEvents);

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

  const tasks = events.map((event) => ({
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

  const handleDateChange = (task, newStart, newEnd) => {
    const updated = tasks.map((t) =>
      t.id === task.id ? { ...t, start: newStart, end: newEnd } : t
    );
    setEvents(
      updated.map((t) => ({
        id: t.id,
        title: t.name,
        type: Object.keys(typeColorMap).find(
          (key) => typeColorMap[key] === t.styles.progressColor
        ) || 'Default',
        startDate: t.start.toISOString().slice(0, 10),
        endDate: t.end.toISOString().slice(0, 10),
      }))
    );
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Timeline View</h2>
        <Select value={viewMode} onValueChange={setViewMode}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select view mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ViewMode.Day}>Day</SelectItem>
            <SelectItem value={ViewMode.Week}>Week</SelectItem>
            <SelectItem value={ViewMode.Month}>Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Gantt
        tasks={tasks}
        viewMode={viewMode}
        onDateChange={handleDateChange}
        now={new Date()}
      />

      {/* 添加事件表单 */}
      <div className="mt-6 p-4 border rounded-lg space-y-2">
        <h3 className="text-lg font-semibold">添加新事件</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <Input
            placeholder="标题"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
          <Select
            value={newEvent.type}
            onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="类型" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(typeColorMap).map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={newEvent.startDate}
            onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
          />
          <Input
            type="date"
            value={newEvent.endDate}
            onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
          />
          <Button onClick={handleAddEvent}>添加</Button>
        </div>
      </div>
    </div>
  );
}
