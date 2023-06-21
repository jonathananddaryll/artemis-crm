import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  getBoard,
  removeFromStatus,
  addToStatus,
  updateJobStatus
} from '../../../reducers/BoardReducer';

import Column from './Column';
import styles from './JobTrackerPage.module.css';

export default function KanbanBoard({ setAddListToggle }) {
  const { selectedBoard, selectedBoardStatusCols } = useSelector(state => ({
    ...state.board
  }));

  const dispatch = useDispatch();

  const { board_id } = useParams();

  // const { selectedBoard } = useSelector(state => ({ ...state.board }));

  // const [selectedBoard, setSelectedBoard] = useState(boards[0]);

  // HAVE A FUNCTION THAT LOADS THIS AND SET ALL THE STATS WHEN JOB IS DONE LOADING. OR MAYBE DONT DO USESTATE. MAKE IT A JOB BOARD STATE IN REDUX
  // const { board_id } = useParams();

  // if (selectedBoard === null) {
  //   console.log(board_id);
  //   dispatch(getBoard(board_id));
  // }

  // const populateBoard = jobs => {
  //   selectedBoardStatusCols.map();
  // };

  const handleDragEnd = (result, selectedBoardStatusCols) => {
    const { destination, source, draggableId } = result;
    console.log(result);
    if (source.droppableId == destination.droppableId) return;

    const formData = {
      newStatus: destination.droppableId,
      boardId: board_id,
      job_id: draggableId
    };

    dispatch(
      addToStatus([destination.droppableId, source.droppableId, draggableId])
    );

    dispatch(
      removeFromStatus([
        destination.droppableId,
        source.droppableId,
        draggableId
      ])
    );

    // THIS IS WHERE THE API CALL IS HAPPENING.. THINK OF A WAY TO MERGE THE addToStatus with this later on
    dispatch(updateJobStatus(formData));
  };

  // Find item by id
  function findItemById(id, array) {
    return array.find(item => item.id == id);
  }

  function removeItemById(id, array) {
    return array.filter(item => item.id != id);
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <h2 style={{ textAlign: 'center' }}>{selectedBoard.title}</h2>

      {/* {selectedBoard !== null && selectedBoardStatusCols !== null && ( */}
      <div className={styles.kanban_container}>
        {/* CHANGE THIS TO SELECTED BOARD LATER */}
        {/* {selectedBoardStatusCols.map((col, idx) => (
            <Column title={col} jobs={applied} id={idx} />
          ))} */}
        {Object.keys(selectedBoardStatusCols).map((keyName, index) => (
          <Column
            title={keyName}
            jobs={selectedBoardStatusCols[keyName]}
            id={keyName}
            key={index}
          />
        ))}
        <div className='addlist-column'>
          <button onClick={() => setAddListToggle(true)}>Add list</button>
        </div>
      </div>
      {/* )} */}
    </DragDropContext>
  );
}
