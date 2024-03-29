import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSession } from '@clerk/clerk-react';
import {
  removeFromStatus,
  addToStatus,
  updateJobStatus,
  deleteColumn,
  updateBoardColumn
} from '../../../../reducers/BoardReducer';
import Column from './Column';
import styles from './KanbanBoard.module.scss';

export default function KanbanBoard({
  setAddListToggle,
  selectedBoard,
  selectedBoardStatusCols
}) {
  const [statusFormToggle, setStatusFormToggle] = useState({
    ind: null,
    state: false,
    column: null
  });

  const dispatch = useDispatch();
  const { board_id } = useParams();
  const { session } = useSession();

  // Handles the dropping of the job
  const handleDragEnd = async result => {
    const { destination, source, draggableId } = result;
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
  };

  const handleColumnDelete = async (columnNum, columnStatus) => {
    const formD = {
      id: selectedBoard.id,
      userId: selectedBoard.user_id,
      totalCols: selectedBoard.total_cols,
      columnToDelete: columnNum,
      columnStatusToDelete: columnStatus,
      selectedBoard_userId: selectedBoard.user_id,
      token: await session.getToken(),
      col10Status: selectedBoard.column10 ?? null,
      col9Status: selectedBoard.column9 ?? null,
      col8Status: selectedBoard.column8 ?? null
    };

    dispatch(deleteColumn(formD));
  };

  // // Find item by ID
  // function findItemById(id, array) {
  //   return array.find(item => item.id == id);
  // }

  // // Remove item by ID
  // function removeItemById(id, array) {
  //   return array.filter(item => item.id != id);
  // }

  return (
    <div className={styles.kanbanContainer}>
      <DragDropContext onDragEnd={handleDragEnd}>
        {Object.keys(selectedBoardStatusCols).map((keyName, index) => (
          <Column
            jobs={selectedBoardStatusCols[keyName]}
            id={keyName}
            key={index}
            title={keyName}
            columnNumber={index + 1}
            handleColumnDelete={handleColumnDelete}
            setStatusFormToggle={setStatusFormToggle}
            statusFormToggle={statusFormToggle}
            selectedBoard={selectedBoard}
            updateBoardColumn={updateBoardColumn}
          />
        ))}
        {/* Add list column only shows when there's less than 10 total status columns */}
        {selectedBoard.total_cols < 10 && (
          <div className={styles.addlistContainer}>
            <button
              className={styles.newListButton}
              onClick={() => setAddListToggle(true)}
            >
              Add list +
            </button>
          </div>
        )}
      </DragDropContext>
    </div>
  );
}
