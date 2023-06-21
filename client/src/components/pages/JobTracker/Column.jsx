import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Job from './Job';
import styled from 'styled-components';
import { handleToggleForm } from '../../../reducers/BoardReducer';
import { useSelector, useDispatch } from 'react-redux';

const Container = styled.div`
  background-color: #e6eefb;
  border-radius: 10px;
  overflow: hidden;
  margin-right: 5px;
  width: 300px;
  min-height: 90vh;
  float: left;
`;

const Status = styled.div`
  display: flex;
  // justify-content: space-between;
  padding: 18px 15px;
  align-items: center;
  position: relative;
`;

const Title = styled.h3`
  margin: 0px;
  text-align: center;
  text-transform: capitalize;
  font-size: 22px;
`;

const TotalJobs = styled.p`
  font-size: 15px;
  margin: 0px 0px 0px 10px;
  padding: 3px 7px;
  background-color: #a3bfeb;
  border-radius: 5px;
`;

const JobList = styled.div`
  padding: 3px;
  min-height: 100px;
`;

const AddButton = styled.button`
  background-color: #a3bfeb;
  color: #125acf;
  padding: 3px;
  font-size: 20px;
  position: absolute;
  right: 15px;
  border-radius: 50%;
  height: 25px;
  width: 25px;

  border: 0;
  padding: 0;
  cursor: pointer;
`;

export default function ({ title, jobs, id }) {
  const dispatch = useDispatch();

  return (
    <Container>
      <Status>
        <Title>{title}</Title>
        <TotalJobs> {jobs.length} </TotalJobs>
        <AddButton onClick={() => dispatch(handleToggleForm([true, title]))}>
          +
        </AddButton>
      </Status>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <JobList
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {jobs.map((jjob, index) => (
              <Job job={jjob} index={index} key={index} />
            ))}

            {provided.placeholder}
          </JobList>
        )}
      </Droppable>
    </Container>
  );
}
