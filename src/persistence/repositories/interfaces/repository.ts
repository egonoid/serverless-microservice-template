import { BaseEntity, EntityPartial } from '@domain/base.entity';

export interface IRepository<T extends BaseEntity> {
  create(entity: EntityPartial<T>): Promise<BaseRepositoryResponse<T>>;

  readAll(
    tenantId: string,
    limit: number,
    cursor?: any
  ): Promise<BaseRepositoryResponse<T[]>>;

  read(tenantId: string, id: string): Promise<BaseRepositoryResponse<T>>;

  search(
    tenantId: string,
    limit: number,
    search: string,
    cursor?: any
  ): Promise<BaseRepositoryResponse<T[]>>;

  update(
    tenantId: string,
    id: string,
    update: Partial<T>
  ): Promise<BaseRepositoryResponse<T>>;

  delete(tenantId: string, id: string): Promise<BaseRepositoryResponse<void>>;
}

export interface BaseRepositoryResponse<T> {
  success: boolean;
  error?: any;
  item?: T;
}
