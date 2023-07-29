import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  removeFromStatus,
  addToStatus,
  updateJobStatus
} from '../../../../reducers/BoardReducer';

import { useSession } from '@clerk/clerk-react';

import Column from './Column';
import styles from './KanbanBoard.module.css';

export default function KanbanBoard({
  setAddListToggle,
  selectedBoard,
  selectedBoardStatusCols
}) {
  // PASSED selectedBoard and selectedBoardStatusCols as a props instead of using useSelector hook. delete this later once everything is finalized and working as planned
  // const { selectedBoard, selectedBoardStatusCols } = useSelector(state => ({
  //   ...state.board
  // }));

  const dispatch = useDispatch();
  const { board_id } = useParams();
  const { session } = useSession();

  // Handles the dropping of the job
  async function handleDragEnd(result) {
    const { destination, source, draggableId } = result;
    console.log(result);
    if (source.droppableId == destination.droppableId) return;

    const formData = {
      oldStatus: source.droppableId,
      newStatus: destination.droppableId,
      boardId: board_id,
      job_id: draggableId,
      selectedBoard_userId: selectedBoard.user_id,
      token: await session.getToken(),
      update_type: `Moved to ${
        destination.droppableId.charAt(0).toUpperCase() +
        destination.droppableId.slice(1)
      }`,
      description: `You moved this job from ${
        source.droppableId.charAt(0).toUpperCase() + source.droppableId.slice(1)
      } to ${
        destination.droppableId.charAt(0).toUpperCase() +
        destination.droppableId.slice(1)
      }`
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
    // ADD TOKEN HERE
    dispatch(updateJobStatus(formData));
  }

  // Find item by id
  function findItemById(id, array) {
    return array.find(item => item.id == id);
  }

  function removeItemById(id, array) {
    return array.filter(item => item.id != id);
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {/* <h2 style={{ textAlign: 'center' }}>{selectedBoard.title}</h2> */}

      {/* {selectedBoard !== null && selectedBoardStatusCols !== null && ( */}
      <div className={styles.kanbanContainer}>
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
        {/* Add list column only shows when there's less than 10 total status columns */}
        {selectedBoard.total_cols < 10 && (
          <div className={styles.addlistContainer}>
            <button onClick={() => setAddListToggle(true)}>Add list</button>
          </div>
        )}
      </div>
      {/* )} */}
    </DragDropContext>
  );
}