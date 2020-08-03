export interface BaseServiceResponse<T> {
  success: boolean;
  error?: BaseServiceError;
  errorMessage?: string;
  item?: T;
  startCursor?: string;
  endCursor?: string;
}

export type BaseServiceError = 'NOT_FOUND';
