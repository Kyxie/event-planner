'use client';

import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

export default function EventForm({ initialData = {}, onSubmit }) {
  const form = useForm({
    defaultValues: {
      title: '',
      type: '',
      start: '',
      end: '',
    },
  });

  const watchedStartDate = useWatch({
    control: form.control,
    name: 'start',
  });

  useEffect(() => {
    form.reset({
      title: initialData.title || '',
      type: initialData.type || '',
      start: initialData.start || '',
      end: initialData.end || '',
    });
  }, [initialData, form]);

  const handleSubmit = (data) => {
    const finalData = {
      ...data,
      id: initialData.id || Date.now().toString(),
      start: new Date(data.start).toISOString(),
      end: new Date(data.end).toISOString(),
    };
    onSubmit(finalData);
  };

  const typeOptions = ['Merger', 'Dividends', 'New Capital', 'Hire', 'IPO', 'Expansion'];
  const [open, setOpen] = useState(false);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          rules={{ required: 'Title is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Event title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Type */}
        <FormField
          control={form.control}
          name="type"
          rules={{ required: 'Type is required' }}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Type</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'w-full justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value || 'Select or type a type'}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Type or select..."
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const newValue = e.currentTarget.value.trim();
                          if (newValue) {
                            field.onChange(newValue);
                            setOpen(false);
                          }
                        }
                      }}
                    />
                    <CommandEmpty>No type found.</CommandEmpty>
                    <CommandGroup>
                      {typeOptions.map((item) => (
                        <CommandItem
                          key={item}
                          value={item}
                          onSelect={(val) => {
                            field.onChange(val);
                            setOpen(false);
                          }}
                        >
                          {item}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start Date */}
        <FormField
          control={form.control}
          name="start"
          rules={{ required: 'Start date is required' }}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? format(new Date(field.value), 'PPP') : 'Pick a date'}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        const adjusted = new Date(date);
                        adjusted.setHours(0, 0, 0, 0);
                        field.onChange(adjusted);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* End Date */}
        <FormField
          control={form.control}
          name="end"
          rules={{ required: 'End date is required' }}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? format(new Date(field.value), 'PPP') : 'Pick a date'}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        const adjusted = new Date(date);
                        adjusted.setHours(0, 0, 0, 0);
                        field.onChange(adjusted);
                      }
                    }}
                    disabled={(date) => {
                      if (!watchedStartDate) return false;
                      return date < new Date(watchedStartDate);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Save
        </Button>
      </form>
    </Form>
  );
}
