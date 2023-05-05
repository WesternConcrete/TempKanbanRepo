import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
} from 'react-beautiful-dnd';
import { hooks, emptyArray } from './store';
import TaskCard from './TaskCard';
import { useLaneStyles } from './styles';
import { useCurrentUserId } from './CurrentUser';


export interface Props {
  id: string,
}

export default function StatusLane({ id }: Props) {
  const currentUserId = useCurrentUserId();
  const createTask = hooks.useCreateTask();
  const updateStatus = hooks.useUpdateStatus();
  const deleteStatus = hooks.useDeleteStatus();
  const { title, taskIds } = hooks.useStatus(id);

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const openTaskForm = () => setIsTaskFormOpen(true);
  const closeTaskForm = () => setIsTaskFormOpen(false);

  const [isStatusEditorOpen, setIsStatusEditorOpen] = useState(false);
  const openStatusEditor = () => setIsStatusEditorOpen(true);
  const closeStatusEditor = () => setIsStatusEditorOpen(false);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const openDeleteConfirm = () => setIsDeleteConfirmOpen(true);
  const closeDeleteConfirm = () => setIsDeleteConfirmOpen(false);

  const handleSubmitNewTask = (title: string, desc: string) => {
    if (createTask && currentUserId) {
      createTask({ title, statusId: id, creatorId: currentUserId, description: desc, });
    }
    closeTaskForm();
  };

  const handleSubmitEditStatus = (title: string) => {
    if (updateStatus) {
      updateStatus(id, { title })
    }
    closeStatusEditor();
  };

  const handleConfirmDelete = () => {
    if (deleteStatus) {
      deleteStatus(id);
    }
  };

  const classNames = useLaneStyles();

  return (
    <Paper
      className={`${classNames.lane} board-status`}
      elevation={0}
    >
      <div className={classNames.laneHeader}>
        <Typography align="center" className={classNames.laneTitle}>{title}</Typography>
      </div>
      <Droppable type="taskCard" droppableId={id.toString()}>
        {(provided: DroppableProvided) => {
          return (
            <div ref={provided.innerRef} {...provided.droppableProps} className={classNames.tasks}>
              {(taskIds || emptyArray).map((taskId, index) => (
                <Draggable key={taskId} draggableId={taskId.toString()} index={index}>
                  {(provided: DraggableProvided) => {
                    return (
                      <div className={classNames.taskContainer} ref={provided.innerRef} {...provided.draggableProps}>
                        <TaskCard statusId={id} id={taskId} dragHandleProps={provided.dragHandleProps} />
                      </div>
                    )
                  }}
                </Draggable>
              ))}
            </div>
          )
        }}
      </Droppable>
    </Paper>
  );
}

export interface StatusOptionsProps {
  onClickEdit: () => void,
  onClickDelete: () => void
}

export function StatusOptions({ onClickEdit, onClickDelete }: StatusOptionsProps) {
  return (
    <List>
      <ListItem button onClick={onClickEdit}>
        <ListItemText primary="Edit Column"/>
      </ListItem>
      <ListItem button onClick={onClickDelete}>
        <ListItemText primary="Delete Column"/>
      </ListItem>
    </List>
  );
}
