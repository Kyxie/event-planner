'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { getEvents, updateEvent, deleteEvent, reorderEvents, resetEventOrder } from '@/api/events';
import EventHeader from '@/components/event/EventHeader';
import EventCard from '@/components/event/EventCard';
import { toast } from 'sonner';
import EventEmpty from '@/components/event/EventEmpty';
import useClientDateRange from '@/hooks/usePersistedDateRange';

export default function EventListPage() {
  const [events, setEvents] = useState([]);
  const [dateRange, setDateRange] = useClientDateRange();

  useEffect(() => {
    if (!dateRange) return;
    fetchEvents();
  }, [dateRange]);

  if (!dateRange) return null;

  const fetchEvents = async () => {
    try {
      const res = await getEvents(dateRange.startDate, dateRange.endDate);
      setEvents(res);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      toast.error('Failed to load events');
    }
  };

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

  const handleSave = () => {
    fetchEvents();
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

  return (
    <div>
      <EventHeader
        dateRange={dateRange}
        setDateRange={setDateRange}
        onSave={handleSave}
        setEvents={setEvents}
        view="list"
        resetOrder={handleResetOrder}
      />

      {events.length === 0 ? (
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
                          onSave={handleSave}
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
