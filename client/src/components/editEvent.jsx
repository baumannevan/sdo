import React, { useState, useEffect } from "react";
import "../styles/CreateEventModal.css"; // can be reused

export default function EditEventModal({ isOpen, onClose, eventToEdit, updateEvent, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    location: "",
    requiredRole: [],
    requires_rsvp: false,  // <-- added here
  });

  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        name: eventToEdit.name || "",
        description: eventToEdit.description || "",
        date: eventToEdit.date?.split("T")[0] || "",
        location: eventToEdit.location || "",
        requiredRole: eventToEdit.requiredRole || [],
        requires_rsvp: eventToEdit.requires_rsvp || false,  // <-- initialize from eventToEdit
      });
    }
  }, [eventToEdit]);

  if (!isOpen || !eventToEdit) return null;

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
    } else if (type === "checkbox" && name === "requires_rsvp") {
      setFormData((prev) => ({
        ...prev,
        requires_rsvp: checked,
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
      await updateEvent(eventToEdit.id, formData);
      await onSave(eventToEdit.id, formData);
      onClose();
    } catch (err) {
      console.error("Error updating event:", err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Event</h2>
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

          {/* requires_rsvp checkbox */}
          <label className="rsvp-checkbox-label">
            Requires RSVP
            <input
              type="radio"
              name="requires_rsvp"
              checked={formData.requires_rsvp}
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
            <button type="submit" className="create-btn">Update Event</button>
          </div>
        </form>
      </div>
    </div>
  );
}
