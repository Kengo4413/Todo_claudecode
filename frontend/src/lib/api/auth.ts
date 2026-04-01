import apiClient from './client'

export interface LoginRequest {
  email: string
  password: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface UserResponse {
  id: number
  email: string
}

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<TokenResponse>('/auth/login', data),

  register: (data: LoginRequest) =>
    apiClient.post<UserResponse>('/auth/register', data),

  getMe: () =>
    apiClient.get<UserResponse>('/auth/me'),
}
