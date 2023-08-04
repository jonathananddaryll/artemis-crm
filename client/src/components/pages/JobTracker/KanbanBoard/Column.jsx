import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Job from './Job';
import styled from 'styled-components';
import {
  handleToggleForm,
  handleColumnUpdateForm
} from '../../../../reducers/BoardReducer';
import { useDispatch } from 'react-redux';

const Container = styled.div`
  position: relative;
  background-color: #e6eefb;
  border-radius: 10px;
  // overflow-y: hidden;
  overflow: hidden;
  margin-right: 5px;
  padding-bottom: 50px;
  width: 300px;
  height: 95vh;
  float: left;
`;

const Status = styled.div`
  display: flex;
  padding: 18px 15px;
  align-items: center;
  position: relative;
`;

const Title = styled.h3`
  margin: 0px;
  text-align: center;
  text-transform: capitalize;
  font-size: 20px;
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
  height: 94%;
  overflow-y: auto;
`;

const AddButton = styled.button`
  font-size: 15px;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #e6eefb;
  border: none;
  padding: 10px 20px;
  text-align: left;

  & span {
    font-size: 25px;
    display: inline-block;
    vertical-align: bottom;
    margin-right: 5px;
  }

  &:hover {
    background-color: #d6e2f7;
  }
`;

const EditButton = styled.button`
  position: absolute;
  right: 15px;
  border: none;
  // background-color: red;
  font-size: 20px;
  color: black;
`;

export default function ({ title, jobs, id }) {
  const dispatch = useDispatch();

  return (
    <Container>
      <Status>
        <Title>{title}</Title>
        <TotalJobs> {jobs.length} </TotalJobs>
        <EditButton>
          <i class='bi bi-three-dots'></i>
        </EditButton>
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
      <AddButton onClick={() => dispatch(handleToggleForm([true, title]))}>
        <i class='bi bi-plus-lg'></i> Add new job
      </AddButton>
    </Container>
  );
}
