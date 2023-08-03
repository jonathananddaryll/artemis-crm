import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import styles from './KanbanBoard.module.css';

import {
  handleToggleForm,
  changeSelectedJob
} from '../../../../reducers/BoardReducer';
import { useDispatch } from 'react-redux';

const Container = styled.div`
  border-radius: 10px;
  padding: 8px;
  color: #000;
  margin-bottom: 8px;
  height: 80px;
  margin-left: 10px;
  margin-right: 10px;
  background-color: white;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;

  ${({ active }) =>
    active &&
    `
    background-color: rgb(191, 167, 236);;
  `}
`;

const CompanyLogo = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: rgb(145, 145, 180);
`;

const TextContent = styled.div`
  text-align: left;
  margin-left: 15px;
  text-transform: capitalize;
  font-size: 14px;
`;

const TitleText = styled.p`
  font-weight: bold;
`;

const CompanyText = styled.p``;

const CreatedText = styled.p``;

export default function Job({ job, index }) {
  const dispatch = useDispatch();
  return (
    <Draggable draggableId={`${job.id}`} key={job.id} index={index}>
      {(provided, snapshot) => (
        <Container
          active={job.got_tasks === true}
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
            <CreatedText>{job.date_created}</CreatedText>
          </TextContent>
          {provided.placeholder}
        </Container>
      )}
    </Draggable>
  );
}
