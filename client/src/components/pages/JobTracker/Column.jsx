import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Job from './Job';
import styled from 'styled-components';

const Container = styled.div`
  background-color: #f4f5f7;
  border-radius: 2.5px;
  width: 300px;
  height: 475px;
  border: 1px solid gray;
`;

const Title = styled.h3`
  padding: 8px;
  background-color: pink;
  text-align: center;
`;

const JobList = styled.div`
  padding: 3px;
  flex-grow: 1;
  min-height: 100px;
`;

export default function ({ title, jobs, id }) {
  return (
    <Container>
      <Title>{title}</Title>
      <Droppable droppableId={id}>
        {(provided, snapshot) => {
          <JobList
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {jobs.map((jjob, index) => (
              <Job job={jjob} index={index} key={index} />
            ))}{' '}
            {/* {provided.placeholder} */}
          </JobList>;
        }}
      </Droppable>
    </Container>
  );
}
