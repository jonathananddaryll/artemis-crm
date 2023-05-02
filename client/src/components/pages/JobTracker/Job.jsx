import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const Job = ({ job, index }) => {
  return (
    <Draggable draggableId={`${job.id}`} key={job.id} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDratting={snapshot.isDragging}
        >
          <p>{job.title}</p>
          <p>{job.company}</p>
        </div>
      )}
    </Draggable>
  );
};

export default Job;
