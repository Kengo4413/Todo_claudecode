import apiClient from './client'

export type Priority = 'urgent' | 'high' | 'medium' | 'low'
export type Status = 'todo' | 'in_progress' | 'done'

export interface Task {
  id: number
  title: string
  description: string | null
  status: Status
  priority: Priority
  due_date: string | null
  completed_at: string | null
  deleted_at: string | null
  category_id: number | null
  created_at: string
  updated_at: string
}

export interface TaskCreate {
  title: string
  description?: string
  priority?: Priority
  due_date?: string
  category_id?: number
}

export interface TaskUpdate {
  title?: string
  description?: string
  status?: Status
  priority?: Priority
  due_date?: string
  category_id?: number
}

export interface TaskListResponse {
  tasks: Task[]
  total: number
}

export interface TaskListParams {
  status?: Status
  priority?: Priority
  category_id?: number
  sort_by?: 'created_at' | 'due_date' | 'priority'
  sort_order?: 'asc' | 'desc'
  include_deleted?: boolean
}

export const tasksApi = {
  list: (params?: TaskListParams) =>
    apiClient.get<TaskListResponse>('/tasks', { params }),

  get: (id: number) =>
    apiClient.get<Task>(`/tasks/${id}`),

  create: (data: TaskCreate) =>
    apiClient.post<Task>('/tasks', data),

  update: (id: number, data: TaskUpdate) =>
    apiClient.put<Task>(`/tasks/${id}`, data),

  toggleComplete: (id: number) =>
    apiClient.patch<Task>(`/tasks/${id}/complete`),

  delete: (id: number) =>
    apiClient.delete(`/tasks/${id}`),

  restore: (id: number) =>
    apiClient.patch<Task>(`/tasks/${id}/restore`),
}
