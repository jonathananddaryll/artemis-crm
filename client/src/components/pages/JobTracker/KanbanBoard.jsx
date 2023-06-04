import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getBoard } from '../../../reducers/BoardReducer';

import { fakej, boards } from './jobs';
import Column from './Column';

export default function KanbanBoard() {
  const { jobs, loading } = useSelector(state => ({ ...state.job }));
  const { boards, selectedBoard, selectedBoardStatusCols } = useSelector(
    state => ({ ...state.board })
  );

  const dispatch = useDispatch();

  // const { selectedBoard } = useSelector(state => ({ ...state.board }));

  // const [selectedBoard, setSelectedBoard] = useState(boards[0]);

  // HAVE A FUNCTION THAT LOADS THIS AND SET ALL THE STATS WHEN JOB IS DONE LOADING. OR MAYBE DONT DO USESTATE. MAKE IT A JOB BOARD STATE IN REDUX
  // const { board_id } = useParams();

  // if (selectedBoard === null) {
  //   console.log(board_id);
  //   dispatch(getBoard(board_id));
  // }

  const [saved, setSaved] = useState(
    jobs.filter(job => job.status === 'saved')
  );
  const [applied, setApplied] = useState(
    jobs.filter(job => job.status === 'applied')
  );
  const [interviewing, setInterviewing] = useState(
    jobs.filter(job => job.status === 'interviewing')
  );

  const handleDragEnd = result => {
    const { destination, source, draggableId } = result;
    if (source.droppableId == destination.droppableId) return;

    // Remove from source array
    if (source.droppableId == 1) {
      setSaved(removeItemById(draggableId, saved));
    } else if (source.droppableId == 2) {
      setApplied(removeItemById(draggableId, applied));
    } else {
      setInterviewing(removeItemById(draggableId, interviewing));
    }

    // Get Item
    const job = findItemById(draggableId, [
      ...saved,
      ...applied,
      ...interviewing
    ]);

    // Add Item
    if (destination.droppableId == 1) {
      setSaved([{ ...job, saved: !job.saved }, ...saved]);
    } else if (destination.droppableId == 2) {
      setApplied([{ ...job, applied: !job.applied }, ...applied]);
    } else {
      setInterviewing([
        { ...job, interviewing: !job.interviewing },
        ...interviewing
      ]);
    }
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
      <h2 style={{ textAlign: 'center' }}>{selectedBoard.board_name}</h2>
      {selectedBoard !== null && selectedBoardStatusCols.length > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row'
          }}
        >
          {/* CHANGE THIS TO SELECTED BOARD LATER */}
          {selectedBoardStatusCols.map((col, idx) => (
            <Column title={col} jobs={applied} id={idx} />
          ))}

          {/* <Column title={selectedBoard.column1} jobs={saved} id={'1'} />
        <Column title={selectedBoard.column2} jobs={applied} id={'2'} />
        <Column title={selectedBoard.column3} jobs={interviewing} id={'3'} /> */}
        </div>
      )}
    </DragDropContext>
  );
}
