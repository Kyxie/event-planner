import { useState } from 'react';
import { format, startOfMonth } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export default function ExpandableDatePicker({ dateRange, setDateRange, fetchEvents }) {
  const today = new Date();
  const [isHovering, setIsHovering] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const shouldExpand = isHovering || isOpen;

  return (
    <div
      className={cn(
        'relative flex items-center transition-all duration-500',
        shouldExpand ? 'gap-2' : 'gap-0'
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        if (!isOpen) setIsHovering(false);
      }}
    >
      {/* Calendar icon */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-500 ease-in-out',
          shouldExpand ? 'max-w-0 scale-95 opacity-0' : 'max-w-[40px] scale-100 opacity-100'
        )}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsHovering(true)}
          className="transition-none"
        >
          <CalendarIcon className="h-4 w-4" />
        </Button>
      </div>

      <div
        className={cn(
          'overflow-hidden transition-all duration-500 ease-in-out',
          shouldExpand ? 'max-w-[320px] scale-100 opacity-100' : 'max-w-0 scale-95 opacity-0'
        )}
      >
        <Popover
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
              setIsHovering(false);
            }
          }}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-9 w-[220px] justify-center text-center font-normal"
            >
              {dateRange?.startDate ? (
                dateRange.endDate ? (
                  <>
                    {format(dateRange.startDate, 'LLL dd, y')} -{' '}
                    {format(dateRange.endDate, 'LLL dd, y')}
                  </>
                ) : (
                  format(dateRange.startDate, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.startDate || startOfMonth(today)}
              selected={{
                from: dateRange.startDate,
                to: dateRange.endDate,
              }}
              onSelect={(range) => {
                setDateRange({
                  startDate: range?.from,
                  endDate: range?.to,
                });
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
