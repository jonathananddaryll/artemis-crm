import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import timeSince from '../../../../helpers/convertDate';
import styles from './KanbanBoard.module.scss';
import { useDispatch } from 'react-redux';
import {
  handleToggleForm,
  changeSelectedJob
} from '../../../../reducers/BoardReducer';

const Container = styled.div`
  border-radius: 10px;
  padding: 7px 10px;
  color: #000;
  // margin-bottom: 8px;
  margin: 0 5px 8px 5px;
  background-color: #fff;
  cursor: pointer;
  align-items: top;
  background-color: ${props => (props.isDragging ? '#b8d5fc' : 'white')};
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
          <div className={styles.jobBox}>
            <p className={styles.textJobTitle}>
              {job.job_title.substring(0, 28)}
            </p>
            <div className={styles.jobInfoFlex}>
              <p className={styles.textCompany}>
                <i className='bi bi-building-fill'></i>
                {job.company}
              </p>
              <p className={styles.textCompany}>
                <i className='bi bi-geo-alt-fill'></i>
                {job.location}
              </p>
            </div>
            <div className={styles.footer}>
              <div className={styles.reminders}>
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
              </div>
              <p className={styles.textCreated}>
                {timeSince(job.date_created)}
              </p>
            </div>
          </div>

          {provided.placeholder}
        </Container>
      )}
    </Draggable>
  );
}
