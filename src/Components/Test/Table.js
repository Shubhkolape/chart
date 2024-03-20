import React from "react";
import CrudActions from "./CrudActions";

const Table = ({ data, onView, onEdit, onDelete , onUpdate}) => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Agent Name</th>
            <th>License Number</th>
            <th>Actions</th>
          </tr>
        </thead>  
        <tbody>
          {data.map((agent, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{agent.agentName}</td>
              <td>{agent.licenseKey}</td>
              <td>{agent._id}</td>
      
              <td>
              <CrudActions
                agentid={agent._id}
                onUpdate={onUpdate}
                onView={onView}
                onDelete={onDelete}
              />
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
