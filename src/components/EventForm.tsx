import React, { useState } from "react";
import { Event, EventFormData } from "../requests/api";

interface EventFormProps {
  event?: Event;
  onSave: (event: EventFormData, images: File[]) => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, onSave }) => {
  const [formData, setFormData] = useState<EventFormData>({
    name: event?.name || "",
    description: event?.description || "",
    startDate: event?.startDate || "",
    endDate: event?.endDate || "",
    totalGuests: event?.totalGuests || 0,
    images: event?.images || [],
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files));
    }
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.name.trim()) {
      errors.push("Name is required.");
    }
    if (!formData.description.trim()) {
      errors.push("Description is required.");
    }
    if (!formData.startDate) {
      errors.push("Start date is required.");
    }
    if (!formData.endDate) {
      errors.push("End date is required.");
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      errors.push("End date cannot be before start date.");
    }
    if (formData.totalGuests <= 0) {
      errors.push("Total guests must be greater than zero.");
    }
    if (selectedImages.length === 0) {
      errors.push("At least one image must be selected.");
    }

    setErrors(errors);

    return errors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData, selectedImages);
    } else {
      alert(errors.join(""));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input
          type="text"
          name="name"
          className="form-control"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          className="form-control"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Start Date</label>
        <input
          type="date"
          name="startDate"
          className="form-control"
          value={formData.startDate}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">End Date</label>
        <input
          type="date"
          name="endDate"
          className="form-control"
          value={formData.endDate}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Total Guests</label>
        <input
          type="number"
          name="totalGuests"
          className="form-control"
          value={formData.totalGuests}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Images</label>
        <input
          type="file"
          name="images"
          className="form-control"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Save
      </button>
    </form>
  );
};

export default EventForm;
