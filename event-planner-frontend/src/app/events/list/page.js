'use client';

import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { getEvents, updateEvent, deleteEvent, reorderEvents, resetEventOrder } from '@/api/events';
import { getAllEventTypes, addEventType, deleteEventType } from '@/api/eventTypes';
import EventHeader from '@/components/event/EventHeader';
import EventCard from '@/components/event/EventCard';
import { toast } from 'sonner';
import EventEmpty from '@/components/event/EventEmpty';
import useClientDateRange from '@/hooks/usePersistedDateRange';

export default function EventListPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventTypes, setEventTypes] = useState([]);
  const [dateRange, setDateRange] = useClientDateRange();
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingKeyword, setPendingKeyword] = useState('');

  const fetchEventTypes = async () => {
    const types = await getAllEventTypes();
    setEventTypes(types);
  };

  const fetchEvents = useCallback(async () => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;
    try {
      setLoading(true);
      const res = await getEvents(dateRange.startDate, dateRange.endDate, {
        keyword: searchTerm.trim(),
      });
      setEvents(res);
    } catch (err) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [dateRange, searchTerm]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    fetchEventTypes();
  }, []);

  const handleDelete = async (event) => {
    try {
      if (!event || !event._id) {
        console.error('Invalid event:', event);
        toast.error('Invalid event');
        return;
      }
      await deleteEvent(event._id);
      await deleteEventType(event.type);
      fetchEvents();
      fetchEventTypes();
      toast.success('Event deleted successfully');
    } catch (err) {
      console.error('Failed to delete event:', err);
      toast.error('Failed to delete event');
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      const existing = events.find((e) => e._id === id);
      if (!existing) return;
      await updateEvent(id, updatedData);

      if (existing.type !== updatedData.type) {
        await deleteEventType(existing.type);
        await addEventType(updatedData.type);
      }

      fetchEvents();
      fetchEventTypes();
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

    const draggedId = moved._id;
    const beforeId = reordered[destination.index - 1]?._id || null;
    const afterId = reordered[destination.index + 1]?._id || null;

    try {
      await reorderEvents(draggedId, beforeId, afterId);
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
        view="list"
        resetOrder={handleResetOrder}
        eventTypes={eventTypes}
        refreshEventTypes={fetchEventTypes}
        setSearchTerm={setSearchTerm}
        pendingKeyword={pendingKeyword}
        setPendingKeyword={setPendingKeyword}
      />

      {loading ? (
        <div className="rounded-xl border bg-white p-6 text-center text-gray-500 shadow-sm">
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
                          eventTypes={eventTypes}
                          refreshEventTypes={fetchEventTypes}
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
