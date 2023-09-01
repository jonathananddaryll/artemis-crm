import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Job from './Job';
import styled from 'styled-components';
import {
  handleToggleForm,
  handleColumnUpdateForm
} from '../../../../reducers/BoardReducer';
import { useDispatch } from 'react-redux';
import StatusUpdateForm from './StatusUpdateForm/StatusUpdateForm';
import styles from './KanbanBoard.module.scss';

const JobList = styled.div`
  padding: 3px;
  overflow-y: auto;
  background-color: ${props => (props.isDraggingOver ? '#E3E8EF' : 'f1f3f7')};

  overflow: auto;
  height: 95%;

  &::-webkit-scrollbar {
    width: 7px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: #e7dddd;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #747171;
  }
`;

export default function ({
  jobs,
  id,
  columnNumber,
  handleColumnDelete,
  title,
  setStatusFormToggle,
  statusFormToggle,
  selectedBoard,
  updateBoardColumn
}) {
  const dispatch = useDispatch();

  return (
    <div className={styles.columnContainer}>
      <div className={styles.header}>
        <div className={styles.textContainer}>
          <h4 className={styles.textStatus}>{title}</h4>
          <p className={styles.textTotalJobs}>{jobs.length}</p>
        </div>

        {columnNumber > 6 && (
          <div className={styles.buttonsContainer}>
            {jobs.length === 0 && (
              <button
                className={styles.statusButton}
                onClick={() => handleColumnDelete(columnNumber, title)}
              >
                <i className='bi bi-trash3'></i>
              </button>
            )}

            <button
              className={styles.statusButton}
              onClick={e =>
                setStatusFormToggle({
                  ind: id,
                  state: true,
                  column: `column${columnNumber}`
                })
              }
            >
              <i className='bi bi-pencil'></i>
            </button>
          </div>
        )}
      </div>
      {statusFormToggle.state && statusFormToggle.ind === id && (
        // <p>AYOOOOOOOOO</p>
        <StatusUpdateForm
          setStatusFormToggle={setStatusFormToggle}
          selectedBoard={selectedBoard}
          statusFormToggle={statusFormToggle}
          updateBoardColumn={updateBoardColumn}
        />
      )}

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
      <button
        className={styles.buttonAddJob}
        onClick={() => dispatch(handleToggleForm([true, title]))}
      >
        <i className='bi bi-plus-lg'></i> Add new job
      </button>
    </div>
  );
}
