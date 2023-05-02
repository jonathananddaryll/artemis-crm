import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const Container = styled.div`
  border-radius: 10px;
  padding: 80px;
  color: #000;
  margin-bottom: 8px;
  min-height: 90px;
  margin-left: 10px;
  margin-right: 10px;
  background-color: green;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const TextContent = styled.div``;

export default function Job({ job, index }) {
  return (
    <Draggable draggableId={`draggable-${job.id}`} key={job.id} index={index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          <TextContent>
            <p>{job.title}</p>
            <p>{job.company}</p>
          </TextContent>
          {/* {provided.placeholder} */}
        </Container>
      )}
    </Draggable>
  );
}
