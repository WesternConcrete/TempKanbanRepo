import { State as NormalizedState } from 'normalized-reducer';

export interface Project {
  meta: ProjectMeta,
  data: ProjectData,
}

export interface ProjectMeta {
  id,
  title: string,
  description: string,
}

export interface ProjectData extends NormalizedState {
  entities: {
    user: Record<string, User>,
    task: Record<string, Task>,
    status: Record<string, Status>,
    tag: Record<string, Tag>,
    comment: Record<string, Comment>,
  },
  ids: {
    user: string[],
    task: string[],
    status: string[],
    tag: string[],
    comment: string[],
  }
}

export interface User {
  id: string,
  username: string,
  createdTaskIds?: string[],
  assignedTaskIds?: string[],
  commentIds?: string[],
}

export interface Task {
  id: string,
  title: string,
  description: string,
  statusId: string,
  creatorId: string,
  assigneeId?: string,
  tagIds?: string[],
  rootCommentIds?: string[],
}

export enum CourseType {
  GE = "GE",
}

export interface Status {
  id: string,
  title: string,
  taskIds?: string[]
}

export interface Tag {
  id: string,
  value: string
  taskIds?: string[]
}

export interface Comment {
  id: string,
  value: string,
  creatorId: string,
  taskId?: string,
  parentCommentId?: string,
  childCommentIds?: string[],
}

export type UpdateProjectData = (projectData: ProjectData) => Promise<void>
