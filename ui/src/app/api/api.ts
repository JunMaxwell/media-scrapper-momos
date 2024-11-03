import axios from 'axios';
import { getSession } from 'next-auth/react';
import { ApiResponse, ScraperResponse } from '@/app/types/api.type';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const api = axios.create({
  baseURL: API_URL,
});

export interface LoginResponse {
  id: number;
  email: string;
  username: string;
  access_token: string;
}

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers['Authorization'] = `Bearer ${session.accessToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const login = async (identifier: string, password: string): Promise<LoginResponse> => {
  try {
    const response: ApiResponse<LoginResponse> = await api.post('/auth/login', { identifier, password });
    if (response.data) {
      return response.data;
    } else {
      console.error('Unexpected login response:', response.data);
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Login error response:', error.response.data);
      throw new Error(error.response.data.message || 'Authentication failed');
    }
    console.error('Login error:', error);
    throw new Error('An unexpected error occurred');
  }
};

export const logout = async () => {
  await api.post('/auth/logout');
}

export const submitUrls = async (urls: string[]): Promise<ApiResponse<ScraperResponse[]>> => {
  try {
    const response: ApiResponse<ScraperResponse[]> = await api.post('/scraper/urls', { urls });
    return response;
  } catch (error) {
    console.error('Submit URLs error:', error);
    throw new Error('An unexpected error occurred');
  }
};

export const fetchMedias = async (): Promise<ApiResponse<ScraperResponse[]>> => {
  try {
    const response: ApiResponse<ScraperResponse[]> = await api.get('/scraper/medias');
    return response;
  } catch (error) {
    console.error('Fetch medias error:', error);
    throw new Error('An unexpected error occurred');
  }
};