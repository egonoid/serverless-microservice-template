import {
  IProductService,
  ICreateProductRequest,
  IUpdateProductRequest,
} from './interfaces/product.service';
import { injectable, inject } from 'inversify';
import uuid from 'uuid/v4';
import * as Types from '../../common/dependency-injection/types';
import { Product } from '../../domain/product.entity';
import { IProductRepository } from '@persistence/repositories/interfaces/product.repository';
import { BaseServiceResponse } from './interfaces/base';
import { EntityPartial } from '@domain/base.entity';

@injectable()
export default class ProductService implements IProductService {
  constructor(
    @inject(Types.ProductRepository) private repository: IProductRepository
  ) {}

  async readAll(tenantId: string): Promise<BaseServiceResponse<Product[]>> {
    const { item } = await this.repository.readAll(tenantId, 100);

    if (!item) {
      return { success: false };
    }

    return { success: true, item };
  }

  async read(
    tenantId: string,
    id: string
  ): Promise<BaseServiceResponse<Product>> {
    const { item } = await this.repository.read(tenantId, id);

    if (!item) {
      return { success: false };
    }

    return { success: true, item };
  }

  async create(
    request: ICreateProductRequest
  ): Promise<BaseServiceResponse<Product>> {
    const newProduct: EntityPartial<Product> = {
      id: uuid(),
      tenantId: request.tenantId,
      description: request.description,
      shortDescription: request.shortDescription,
      subline: request.subline,
      name: request.name,
    };

    const { item } = await this.repository.create(newProduct);

    if (!item) {
      return { success: false };
    }

    return { success: true, item };
  }

  async update(
    request: IUpdateProductRequest
  ): Promise<BaseServiceResponse<Product>> {
    const { tenantId, id } = request;
    const { item: current } = await this.repository.read(tenantId, id);

    if (!current) {
      return { success: false };
    }

    const update: Partial<Product> = {
      ...current,
      ...request,
    };

    const { item } = await this.repository.update(tenantId, id, update);

    if (!item) {
      return { success: false };
    }

    return { success: true, item };
  }

  async delete(
    tenantId: string,
    id: string
  ): Promise<BaseServiceResponse<void>> {
    return await this.repository.delete(tenantId, id);
  }
}
