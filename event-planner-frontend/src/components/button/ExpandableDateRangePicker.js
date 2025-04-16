import { useState } from 'react'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from "@/lib/utils"

export default function ExpandableDatePicker({ dateRange, setDateRange }) {
  const today = new Date()
  const [isHovering, setIsHovering] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const shouldExpand = isHovering || isOpen

  return (
    <div
      className={cn(
        "relative flex items-center transition-all duration-500",
        shouldExpand ? "gap-2" : "gap-0"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        if (!isOpen) setIsHovering(false)
      }}
    >
      {/* Calander icon */}
      <div
        className={cn(
          "transition-all duration-500 ease-in-out overflow-hidden",
          shouldExpand ? "max-w-0 opacity-0 scale-95" : "max-w-[40px] opacity-100 scale-100"
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
          "transition-all duration-500 ease-in-out overflow-hidden",
          shouldExpand ? "max-w-[320px] opacity-100 scale-100" : "max-w-0 opacity-0 scale-95"
        )}
      >
        <Popover
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open)
            if (!open) setIsHovering(false)
          }}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="pl-3 w-[300px] justify-start text-left font-normal h-9"
            >
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(dateRange.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from || startOfMonth(today)}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
