'use client';

import { ClipboardList } from 'lucide-react';

export default function TaskListTable({ tasks, rowHeight, onClickTask }) {
  return (
    <div className="divide-y border-r border-b">
      {tasks.map((task) => (
        <div
          key={task.id}
          onClick={() => onClickTask?.(task)}
          style={{
            height: rowHeight,
            lineHeight: `${rowHeight}px`,
            cursor: 'pointer',
          }}
          className="flex items-center gap-2 truncate overflow-hidden px-4 text-sm whitespace-nowrap text-black hover:bg-accent"
        >
          <ClipboardList className="text-muted-foreground h-4 w-4 flex-shrink-0" />
          <span className="truncate">{task.name}</span>
        </div>
      ))}
    </div>
  );
}

