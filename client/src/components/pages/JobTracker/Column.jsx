import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Job from './Job';

const Column = ({ title, jobs, id }) => {
  return (
    <div
      style={{
        backgroundColor: '#f4f5f7',
        width: '300px',
        height: '475px',
        border: '1px solid gray'
      }}
    >
      <h3
        style={{
          padding: '6px',
          backgroundColor: 'yellow',
          textAlign: 'center'
        }}
      >
        {title}
      </h3>
      <Droppable droppableId={id}>
        {(provided, snapshot) => {
          <div
            style={{
              padding: '3px',
              backgroundColor: 'green',
              flexGrow: '1',
              minHeight: '100px'
            }}
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {jobs.map(jjob => (
              <Job job={jjob} index={jjob.id} />
            ))}
          </div>;
        }}
      </Droppable>
    </div>
  );
};

export default Column;
