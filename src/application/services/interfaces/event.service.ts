export interface IEventService {
  publish(
    event: string,
    payload: any,
    version: number,
    tenantId?: string
  ): Promise<void>;
}
