'use client';

import { ListTodo } from 'lucide-react';

export default function TaskListHeader({ rowHeight }) {
  return (
    <div
      style={{ height: rowHeight, lineHeight: `${rowHeight}px` }}
      className="bg-muted flex items-center overflow-hidden border-b px-4 text-sm font-bold whitespace-nowrap text-black"
    >
      <ListTodo className="mr-2 h-4 w-4 flex-shrink-0" />
      <span className="truncate">Task Name</span>
    </div>
  );
}
