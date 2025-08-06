import React, { useState } from "react";
import "../styles/CreateEventModal.css"; 
import { useEvents } from "../hooks/useEvents";

export default function CreateEventModal({ isOpen, onClose }) {
  const { createEvent, error, loading } = useEvents();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    location: "",
    requiredRole: "",
  });

  if (!isOpen) return null; 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form:", formData);
    try {
      await createEvent(formData);
      console.log("Event created successfully");
      onClose();
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Create Event</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            Name:
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </label>

          <label>
            Description:
            <textarea name="description" value={formData.description} onChange={handleChange} />
          </label>

          <label>
            Date:
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </label>

          <label>
            Location:
            <input type="text" name="location" value={formData.location} onChange={handleChange} required />
          </label>

          <label>
            Required Role:
            <input type="text" name="requiredRole" value={formData.requiredRole} onChange={handleChange} />
          </label>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="create-btn">Create Event</button>
          </div>

        </form>
      </div>
    </div>
  );
}
