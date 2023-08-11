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
  background-color: #f1f3f7;
  border-radius: 10px;
  overflow: hidden;
  margin-right: 5px;
  padding-bottom: 40px;
  width: 300px;
`;

const Status = styled.div`
  display: flex;
  padding: 15px;
  align-items: center;
  position: relative;
`;

const Title = styled.p`
  margin: 0px;
  text-align: center;
  text-transform: capitalize;
  font-size: 20px;
  font-weight: 500;
  color: #6c788d;
`;

const TotalJobs = styled.p`
  font-size: 13px;
  margin: 0px 0px 0px 10px;
  padding: 4px 8px;
  background-color: #97a2b6;
  border-radius: 5px;
  line-height: 1;
  color: #fff;
`;

const JobList = styled.div`
  padding: 3px;
  height: 94%;
  overflow-y: auto;
  background-color: ${props => (props.isDraggingOver ? '#E3E8EF' : 'f1f3f7')};
`;

const AddButton = styled.button`
  font-size: 15px;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #f1f3f7;
  color: #6c788d;
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
    background-color: #e3e5ea;
  }
`;

const EditButton = styled.button`
  position: absolute;
  right: 15px;
  border: none;
  background-color: transparent;
  font-size: 20px;
  color: #97a2b6;
`;

export default function ({ title, jobs, id }) {
  const dispatch = useDispatch();

  return (
    <Container>
      <Status>
        <Title>{title}</Title>
        <TotalJobs> {jobs.length} </TotalJobs>
        <EditButton>
          <i className='bi bi-three-dots'></i>
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
        <i className='bi bi-plus-lg'></i> Add new job
      </AddButton>
    </Container>
  );
}
