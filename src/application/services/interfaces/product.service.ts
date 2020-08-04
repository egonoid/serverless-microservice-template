import { Product } from '../../../domain/product.entity';
import { BaseServiceResponse } from './base';
import { SortType } from '@common/enums/sortType.enum';

export interface IProductService {
  readAll(
    tenantId: string,
    limit?: number,
    sort?: SortType,
    afterCursor?: string,
    beforeCursor?: string,
    search?: string
  ): Promise<BaseServiceResponse<Product[]>>;
  read(tenantId: string, id: string): Promise<BaseServiceResponse<Product>>;
  create(request: ICreateProductRequest): Promise<BaseServiceResponse<Product>>;
  update(request: IUpdateProductRequest): Promise<BaseServiceResponse<Product>>;
  delete(tenantId: string, id: string): Promise<BaseServiceResponse<void>>;
}

export interface ICreateProductRequest {
  tenantId: string;
  name: string;
  description: string;
  shortDescription: string;
  subline: string;
}

export interface IUpdateProductRequest {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  shortDescription: string;
  subline: string;
  images: {
    id: string;
    originId: string;
    ext: string;
  }[];
}
