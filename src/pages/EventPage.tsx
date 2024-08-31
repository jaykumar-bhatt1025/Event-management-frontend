import React, { useState } from "react";
import EventList from "../components/EventList";
import EventForm from "../components/EventForm";
import {
  Event,
  EventFormData,
  createEvent,
  updateEvent,
} from "../requests/api";
import { Modal } from "react-bootstrap";

const EventPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [refreshEvents, setRefreshEvents] = useState(false);

  const handleCreate = () => {
    setCurrentEvent(null);
    setShowModal(true);
  };

  const handleEdit = (event: Event) => {
    setCurrentEvent(event);
    setShowModal(true);
  };

  const handleSave = async (event: EventFormData, images: File[]) => {
    try {
      if (currentEvent) {
        await updateEvent({ ...event, id: currentEvent.id }, images);
      } else {
        await createEvent(event, images);
      }
      setShowModal(false);
      setRefreshEvents(!refreshEvents);
    } catch (error) {
      console.error("Failed to save event:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Event CRUD</h1>
      <EventList
        onEdit={handleEdit}
        onCreate={handleCreate}
        refreshEvents={refreshEvents}
      />
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentEvent ? "Edit Event" : "Create Event"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EventForm event={currentEvent || undefined} onSave={handleSave} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EventPage;
