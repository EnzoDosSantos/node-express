export interface Joke {
  id: number;
  text: string;
  userId?: number;
  categoryId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface JokeCreateDTO {
  text: string;
  userId?: number;
  categoryId?: number;
}

export interface JokeUpdateDTO {
  text: string;
}

export interface ChuckNorrisJoke {
  icon_url: string;
  id: string;
  url: string;
  value: string;
}

export interface DadJoke {
  id: string;
  joke: string;
  status: number;
}

export interface PairedJoke {
  chuck: string;
  dad: string;
  combinado: string;
}

export interface User {
  id: number;
  name: string;
  createdAt?: Date;
}

export interface Category {
  id: number;
  name: string;
  createdAt?: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}

export interface LcmRequest {
  numbers: number[];
}

export interface LcmResponse {
  numbers: number[];
  lcm: number;
}

export interface IncrementResponse {
  original: number;
  result: number;
}

export class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class ExternalApiError extends ApiError {
  constructor(message: string) {
    super(message, 502);
    this.name = 'ExternalApiError';
  }
}

export type JokeSource = 'Chuck' | 'Dad';

export interface JokeSourceConfig {
  name: JokeSource;
  url: string;
  parseResponse: (data: unknown) => string;
}
