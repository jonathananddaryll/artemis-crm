import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  getBoard,
  removeFromStatus,
  addToStatus
} from '../../../reducers/BoardReducer';

import Column from './Column';

export default function KanbanBoard({ setAddListToggle }) {
  const { jobs, boards, selectedBoard, selectedBoardStatusCols } = useSelector(
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

  // const populateBoard = jobs => {
  //   selectedBoardStatusCols.map();
  // };

  const handleDragEnd = (result, selectedBoardStatusCols) => {
    const { destination, source, draggableId } = result;
    console.log(result);
    if (source.droppableId == destination.droppableId) return;

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
      {/*       
      {selectedBoard !== null && selectedBoardStatusCols.length > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row'
          }}
        >
          //  CHANGE THIS TO SELECTED BOARD LATER 
          {selectedBoardStatusCols.map((col, idx) => (
            <Column title={col} jobs={applied} id={idx} />
          ))}


        </div>
      )} */}

      {selectedBoard !== null && selectedBoardStatusCols !== null && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            padding: '10px 30px'
          }}
        >
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
      )}
    </DragDropContext>
  );
}
