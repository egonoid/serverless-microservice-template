import {
  IProductService,
  ICreateProductRequest,
  IUpdateProductRequest,
} from './interfaces/product.service';
import { injectable, inject } from 'inversify';
import { v4 as uuid } from 'uuid';
import * as Types from '../../common/dependency-injection/types';
import { Product } from '../../domain/product.entity';
import { IProductRepository } from '@persistence/repositories/interfaces/product.repository';
import { BaseServiceResponse } from './interfaces/base';
import { EntityPartial } from '@domain/base.entity';
import { SortType } from '@common/enums/sortType.enum';
import { BaseRepositoryResponse } from '@persistence/repositories/interfaces/repository';
import { deserializeCursor } from '@common/util/deserializeCursor.util';
import { serializeCursor } from '@common/util/serializeCursor.util';

@injectable()
export default class ProductService implements IProductService {
  constructor(
    @inject(Types.ProductRepository) private repository: IProductRepository
  ) {}

  async readAll(
    tenantId: string,
    limit: number = 100,
    sort: SortType = SortType.DESC,
    afterCursor?: string,
    beforeCursor?: string,
    search?: string
  ): Promise<BaseServiceResponse<Product[]>> {
    let response: BaseRepositoryResponse<Product[]>;

    if (search) {
      response = await this.repository.search(
        tenantId,
        limit,
        search,
        sort === SortType.ASC,
        beforeCursor && deserializeCursor(beforeCursor),
        afterCursor && deserializeCursor(afterCursor)
      );
    } else {
      response = await this.repository.readAll(
        tenantId,
        limit,
        sort === SortType.ASC,
        beforeCursor && deserializeCursor(beforeCursor),
        afterCursor && deserializeCursor(afterCursor)
      );
    }

    const { item, startCursor, endCursor } = response;

    if (!item) {
      return { success: false };
    }

    return {
      success: true,
      item,
      startCursor: startCursor && serializeCursor(startCursor),
      endCursor: endCursor && serializeCursor(endCursor),
    };
  }

  async read(
    tenantId: string,
    id: string
  ): Promise<BaseServiceResponse<Product>> {
    const { item } = await this.repository.read(tenantId, id);

    if (!item) {
      return { success: false, error: 'NOT_FOUND' };
    }

    return { success: true, item };
  }

  async create(
    request: ICreateProductRequest
  ): Promise<BaseServiceResponse<Product>> {
    const newProduct: EntityPartial<Product> = {
      id: uuid(),
      ...request,
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
      return { success: false, error: 'NOT_FOUND' };
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
