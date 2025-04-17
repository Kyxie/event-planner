'use client';

import { CalendarX } from 'lucide-react';

export default function EventEmpty({
  title = 'No event right now',
  description = 'Click the button in the top right to create a new event',
}) {
  return (
    <div className="text-muted-foreground flex h-[300px] flex-col items-center justify-center gap-2 text-center">
      <CalendarX className="h-12 w-12 text-gray-400" />
      <p className="text-lg font-semibold">{title}</p>
      <p className="text-sm">{description}</p>
    </div>
  );
}
