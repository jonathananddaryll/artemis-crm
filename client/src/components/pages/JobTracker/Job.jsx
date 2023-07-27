import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

import {
  handleToggleForm,
  changeSelectedJob
} from '../../../reducers/BoardReducer';
import { useDispatch } from 'react-redux';

const Container = styled.div`
  border-radius: 10px;
  padding: 8px;
  color: #000;
  margin-bottom: 8px;
  min-height: 90px;
  margin-left: 10px;
  margin-right: 10px;
  background-color: white;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const CompanyLogo = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgb(145, 145, 180);
`;

const TextContent = styled.div`
  text-align: left;
  margin-left: 15px;
  text-transform: capitalize;
`;

const TitleText = styled.p`
  margin: 2px 0;
  font-weight: bold;
`;

const CompanyText = styled.p`
  margin: 2px 0;
`;

const LocationText = styled.p`
  margin: 2px 0;
`;

export default function Job({ job, index }) {
  const dispatch = useDispatch();
  return (
    <Draggable draggableId={`${job.id}`} key={job.id} index={index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
          onClick={() => dispatch(changeSelectedJob([true, job]))}
        >
          <CompanyLogo />
          <TextContent>
            <TitleText>{job.job_title}</TitleText>
            <CompanyText>{job.company}</CompanyText>
            <LocationText>{job.location}</LocationText>
          </TextContent>
          {provided.placeholder}
        </Container>
      )}
    </Draggable>
  );
}
