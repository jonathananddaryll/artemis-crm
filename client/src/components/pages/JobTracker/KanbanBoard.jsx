import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import { fakej, boards } from './jobs';
import Column from './Column';

export default function KanbanBoard() {
  const [selectedBoard, setSelectedBoard] = useState(boards[0]);

  const [saved, setSaved] = useState(fakej.filter(j => j.status === 'saved'));
  const [applied, setApplied] = useState(
    fakej.filter(j => j.status === 'applied')
  );
  const [interviewing, setInterviewing] = useState(
    fakej.filter(j => j.status === 'interviewing')
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row'
        }}
      >
        <Column title={selectedBoard.column1} jobs={saved} id={'1'} />
        <Column title={selectedBoard.column2} jobs={applied} id={'2'} />
        <Column title={selectedBoard.column3} jobs={interviewing} id={'3'} />
      </div>
    </DragDropContext>
  );
}
