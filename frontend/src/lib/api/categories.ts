import apiClient from './client'

export interface Category {
  id: number
  name: string
  color: string
  created_at: string
}

export interface CategoryCreate {
  name: string
  color?: string
}

export interface CategoryUpdate {
  name?: string
  color?: string
}

export const categoriesApi = {
  list: () =>
    apiClient.get<Category[]>('/categories'),

  create: (data: CategoryCreate) =>
    apiClient.post<Category>('/categories', data),

  update: (id: number, data: CategoryUpdate) =>
    apiClient.put<Category>(`/categories/${id}`, data),

  delete: (id: number) =>
    apiClient.delete(`/categories/${id}`),
}
