import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import styles from './KanbanBoard.module.css';
import timeSince from '../../../../helpers/convertDate';

import {
  handleToggleForm,
  changeSelectedJob
} from '../../../../reducers/BoardReducer';
import { useDispatch } from 'react-redux';

// FOR INTERVIEW and TASK ICON
/* <i class="bi bi-calendar-check"></i> */
/* <i class="bi bi-check2-square"></i> */

const Container = styled.div`
  border-radius: 10px;
  padding: 8px;
  color: #000;
  margin-bottom: 8px;
  // height: 80px;
  margin-left: 10px;
  margin-right: 10px;
  background-color: white;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: top;

  ${({ active }) =>
    active &&
    `
    background-color: rgb(191, 167, 236);;
  `}
`;

const CompanyLogo = styled.div`
  width: 45px;
  height: 45px;
  margin-top: 8px;
  border-radius: 50%;
  background-color: rgb(145, 145, 180);
`;

const TextContent = styled.div`
  text-align: left;
  margin-left: 10px;
  flex: 1;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  // background: red;
  padding: 0 5px 0 20px;
  height: 20px;
`;

const Reminders = styled.div`
  flex: 1;
  display: flex;
  gap: 10px;
`;

const TitleText = styled.p`
  text-transform: capitalize;
  font-size: 17px;
  font-weight: 500;
`;

const CompanyText = styled.p`
  text-transform: capitalize;
  font-size: 15px;

  i {
    font-size: 13px;
    margin-right: 4px;
  }
`;

const CreatedText = styled.p`
  font-size: 12px;
`;

export default function Job({ job, index }) {
  const dispatch = useDispatch();
  return (
    <Draggable draggableId={`${job.id}`} key={job.id} index={index}>
      {(provided, snapshot) => (
        <Container
          // active={job.got_tasks === true} // USE THIS LATER IF WE DECIDE TO COLOR COORDINATE IF A JOB HAS A TASK/INTERVIEW
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
          onClick={() => dispatch(changeSelectedJob([true, job]))}
        >
          <CompanyLogo />
          <TextContent>
            <TitleText>{job.job_title.substring(0, 28)}</TitleText>
            <CompanyText>
              <i className='bi bi-building-fill'></i>
              {job.company}
            </CompanyText>
            <CompanyText>
              <i className='bi bi-geo-alt-fill'></i>
              {job.location}
            </CompanyText>
            <Footer>
              <Reminders>
                {/* for incomplete task count */}
                {job.incomplete_task_count > 0 && (
                  <i className='bi bi-check2-square'></i>
                )}
                {/* for note count */}
                {job.total_note_count > 0 && (
                  <i className='bi bi-journal-text'></i>
                )}
                {/* for total pending interview count */}
                {job.pending_interview_count > 0 && (
                  <i className='bi bi-telephone'></i>
                )}
              </Reminders>
              <CreatedText>{timeSince(job.date_created)}</CreatedText>
            </Footer>
          </TextContent>
          {provided.placeholder}
        </Container>
      )}
    </Draggable>
  );
}
