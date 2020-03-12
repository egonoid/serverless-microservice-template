export interface BaseServiceResponse<T> {
  success: boolean;
  error?: any;
  item?: T;
}
