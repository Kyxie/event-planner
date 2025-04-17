'use client';

import { ClipboardList } from 'lucide-react';

export default function TaskListTable({ tasks, rowHeight }) {
  return (
    <div className="divide-y border-r border-b">
      {tasks.map((task) => (
        <div
          key={task.id}
          style={{
            height: rowHeight,
            lineHeight: `${rowHeight}px`,
          }}
          className="flex items-center gap-2 px-4 text-sm whitespace-nowrap text-black truncate overflow-hidden"
        >
          <ClipboardList className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
          <span className="truncate">{task.name}</span>
        </div>
      ))}
    </div>
  );
}
