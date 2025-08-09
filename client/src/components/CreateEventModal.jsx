import React, { useState } from "react";
import "../styles/CreateEventModal.css"; 

export default function CreateEventModal({ isOpen, onClose, createEvent }) {

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    location: "",
    requiredRole: [],
    rsvp_required: false,
  });

  if (!isOpen) return null; 

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "requiredRole") {
      setFormData((prev) => {
        if (checked) {
          return {
            ...prev,
            requiredRole: [...prev.requiredRole, value],
          };
        } else {
          return {
            ...prev,
            requiredRole: prev.requiredRole.filter((r) => r !== value),
          };
        }
      });
    } else if (type === "radio" && name === "rsvp_required") {
      setFormData((prev) => ({
        ...prev,
        rsvp_required: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEvent(formData);
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

          <label className="rsvp-checkbox-label">
          Requires RSVP
          <input
            type="radio"
            name="rsvp_required"
            checked={formData.rsvp_required}
            onChange={handleChange}
          />
        </label>

          <label>
            <div className="role-checkboxes">
              <p>Required Roles: </p>
              {["Officer", "Intermediate Member", "Associate Member"].map((role) => (
                <label key={role} className="role-checkbox-label">
                  <input
                    type="checkbox"
                    name="requiredRole"
                    value={role}
                    checked={formData.requiredRole.includes(role)}
                    onChange={handleChange}
                  />
                  {role}
                </label>
              ))}
            </div>
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
