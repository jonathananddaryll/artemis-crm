import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import { fakej, boards } from './jobs';
import Column from './Column';

export default function KanbanBoard() {
  const [fakejobs, setFakejobs] = useState(fakej);
  const [selectedBoard, setSelectedBoard] = useState(boards[0]);

  const [saved, setSaved] = useState(fakej);
  const [applied, setApplied] = useState([]);
  const [interviewing, setInterviewing] = useState([]);

  return (
    <DragDropContext>
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
      </div>
    </DragDropContext>
  );
}
