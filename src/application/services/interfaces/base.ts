export interface BaseServiceResponse<T> {
  success: boolean;
  error?: BaseServiceError;
  item?: T;
}

export type BaseServiceError = 'NOT_FOUND';
