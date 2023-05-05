import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import {
  DragDropContext,
  DropResult,
  Droppable,
  DroppableProvided,
} from 'react-beautiful-dnd';
import AddIcon from '@material-ui/icons/Add';
import { hooks, emptyArray } from './store';
import { useBoardStyles } from './styles';
import StatusLane from './StatusLane';
import { Fab } from '@material-ui/core';
import TaskEditorForm from './TaskEditorForm';
import { useCurrentUserId } from './CurrentUser';
import {handleCloseModal} from "../helpers/shared"


export default function Project() {
  const currentUserId = useCurrentUserId();
  const statusIds = hooks.useStatusIds();
  const createTask = hooks.useCreateTask();
  const moveStatus = hooks.useMoveStatus();
  const moveTask = hooks.useMoveStatusTask();


  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const openTaskForm = () => setIsTaskFormOpen(true);
  const closeTaskForm = () => setIsTaskFormOpen(false);

  const classNames = useBoardStyles();


  const handleDragEnd = ({ type, source, destination, draggableId }: DropResult) => {
    if (source && destination) {
      if (type === 'statusLane' && moveStatus) {
        moveStatus(source.index, destination.index);
      }

      if (type === 'taskCard' && moveTask) {
        moveTask(
          draggableId,
          source.droppableId,
          source.index,
          destination.droppableId,
          destination.index
        )
      }
    }
  };

  const handleSubmitNewTask = (title: string, desc: string) => {
    if (createTask && currentUserId) {
      createTask({ title, statusId: "c41ba2a3-5068-4a8f-b8b0-568ca295ef56", creatorId: currentUserId, description: desc, });
    }
    closeTaskForm();
  };

  return (
    <div className={classNames.board}>
      {createTask && (
          <Dialog open={isTaskFormOpen} onClose={(event, reason) => (handleCloseModal(event, reason, closeTaskForm))}>
            <Paper className={classNames.dialog}>
              <TaskEditorForm onSubmit={handleSubmitNewTask} onCancel={closeTaskForm}/>
            </Paper>
          </Dialog>
        )}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable type="statusLane" droppableId="projectBoard" direction="horizontal">
          {(provided: DroppableProvided) => {
            return (
              <div ref={provided.innerRef} {...provided.droppableProps} className={classNames.lanes}>
                {(statusIds || emptyArray).map((statusId, index) => (
                   <div className={classNames.laneContainer} key={index}>
                   <StatusLane id={statusId}  />
                 </div>
                ))}
                {provided.placeholder}
              </div>
            )
          }}
        </Droppable>
      </DragDropContext>
      <div className={classNames.addButtonContainer}>
        <Fab color="primary" aria-label="add" onClick={() => openTaskForm()}>
          <AddIcon />
        </Fab>
      </div>
    </div>
  );
}
