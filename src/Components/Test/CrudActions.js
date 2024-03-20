import React from 'react';

const CrudActions = ({ onView, onEdit, onDelete }) => {
  return (
    <div className="crud-actions">
      <button onClick={onView}>View</button>
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
}

export default CrudActions;
