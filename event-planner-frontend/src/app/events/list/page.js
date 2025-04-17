'use client';

import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { getEvents, updateEvent, deleteEvent, reorderEvents, resetEventOrder } from '@/api/events';
import EventHeader from '@/components/event/EventHeader';
import EventCard from '@/components/event/EventCard';
import { toast } from 'sonner';
import EventEmpty from '@/components/event/EventEmpty';
import useClientDateRange from '@/hooks/usePersistedDateRange';

export default function EventListPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useClientDateRange();

  const fetchEvents = useCallback(async () => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;
    try {
      setLoading(true);
      const res = await getEvents(dateRange.startDate, dateRange.endDate);
      setEvents(res);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      fetchEvents();
      toast.success('Event deleted successfully');
    } catch (err) {
      console.error('Failed to delete event:', err);
      toast.error('Failed to delete event');
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await updateEvent(id, updatedData);
      fetchEvents();
      toast.success('Event updated successfully');
    } catch (err) {
      console.error('Failed to update event:', err);
      toast.error('Failed to update event');
    }
  };

  const handleDragEnd = async (result) => {
    const { destination, source } = result;

    if (!destination || destination.index === source.index) return;

    const reordered = [...events];
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);

    setEvents(reordered);

    const orderedIds = reordered.map((e) => e._id);

    try {
      await reorderEvents(orderedIds);
      toast.success('Event order saved');
      fetchEvents();
    } catch (err) {
      console.error('Failed to reorder:', err);
      toast.error('Failed to reorder events');
    }
  };

  const handleResetOrder = async () => {
    try {
      await resetEventOrder();
      toast.success('Order reset successfully');
      fetchEvents();
    } catch (err) {
      console.error('Failed to reset order:', err);
    }
  };

  if (!dateRange) return null;

  return (
    <div>
      <EventHeader
        dateRange={dateRange}
        setDateRange={setDateRange}
        onSave={fetchEvents}
        setEvents={setEvents}
        view="list"
        resetOrder={handleResetOrder}
      />

      {loading ? (
        <div className="rounded-xl border bg-white shadow-sm p-6 text-center text-gray-500">
          Loading...
        </div>
      ) : events.length === 0 ? (
        <EventEmpty />
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="event-list">
            {(provided) => (
              <ul className="space-y-4" ref={provided.innerRef} {...provided.droppableProps}>
                {events.map((event, index) => (
                  <Draggable key={event._id} draggableId={event._id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <EventCard
                          event={event}
                          onSave={fetchEvents}
                          onDelete={handleDelete}
                          onUpdate={handleUpdate}
                        />
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}
