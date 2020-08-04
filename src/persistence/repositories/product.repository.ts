import { BaseRepositoryResponse } from './interfaces/repository';
import { Product } from '@domain/product.entity';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { ProductDataModel } from '@persistence/models/product.data';
import { inject, injectable } from 'inversify';
import { IProductRepository } from './interfaces/product.repository';
import { DITypes } from '@common/dependency-injection';
import { ProductMapper } from '@persistence/mappers/product.mapper';
import { ImageMapper } from '@persistence/mappers/image.mapper';
import { EntityPartial } from '@domain/base.entity';
import {
  READ_ALL_INDEX,
  ProductStoreDataModel,
  ModelType,
} from '@persistence/models';
import {
  filterModels,
  sortModels,
  createCursor,
} from '@persistence/extensions/repository.extensions';
import { ImageDataModel } from '@persistence/models/image.data';
import { SortType } from '@common/enums/sortType.enum';

@injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @inject(DITypes.DatabaseStore)
    private store: DynamoStore<ProductStoreDataModel>,
    @inject(DITypes.ProductMapper)
    private productMapper: ProductMapper,
    @inject(DITypes.ImageMapper)
    private imageMapper: ImageMapper
  ) {}

  async create(
    item: EntityPartial<Product>
  ): Promise<BaseRepositoryResponse<Product>> {
    const now = new Date().toISOString();

    const productModel = this.productMapper.mapToModel({
      ...item,
      createdAt: now,
      updatedAt: now,
    });

    const imageModels = item.images?.map((img, i) =>
      this.imageMapper.mapToModel(img, {
        tenantId: item.tenantId,
        productId: item.id,
        createdAt: now,
        updatedAt: now,
        index: i,
      })
    );

    await this.store
      .batchWrite()
      .put([productModel, ...(imageModels ?? [])])
      .exec();

    const entity = this.productMapper.mapToEntity(productModel, imageModels);

    return {
      success: true,
      item: entity,
    };
  }

  async readAll(
    tenantId: string,
    limit: number,
    scanIndexForward = true,
    beforeCursor?: string,
    afterCursor?: string
  ): Promise<BaseRepositoryResponse<Product[]>> {
    const cursor = beforeCursor ?? afterCursor;
    scanIndexForward = beforeCursor ? !scanIndexForward : scanIndexForward;

    const request = this.store
      .query()
      .index(READ_ALL_INDEX)
      .wherePartitionKey(tenantId)
      .whereSortKey()
      .beginsWith(`${ModelType.PRODUCT}`)
      .exclusiveStartKey(cursor ? JSON.parse(cursor) : undefined)
      .limit(limit + 1);

    if (scanIndexForward) {
      request.ascending();
    } else {
      request.descending();
    }

    const { Items } = await request.execFullResponse();

    let models = Items.slice(0, limit) as ProductDataModel[];

    if (beforeCursor && !scanIndexForward) {
      models = sortModels<ProductDataModel>(models, 'sortKey', SortType.ASC);
    } else if (beforeCursor && scanIndexForward) {
      models = sortModels<ProductDataModel>(models, 'sortKey', SortType.DESC);
    }

    const products = models.map((model) =>
      this.productMapper.mapToEntity(model)
    );

    return {
      success: true,
      item: products,
      startCursor:
        (afterCursor && models[0]) || (beforeCursor && Items.length > limit)
          ? createCursor(models[0])
          : undefined,
      endCursor:
        (beforeCursor && models[models.length - 1]) ||
        (afterCursor && Items.length > limit)
          ? createCursor(models[models.length - 1])
          : undefined,
    };
  }

  async read(
    tenantId: string,
    id: string
  ): Promise<BaseRepositoryResponse<Product>> {
    const models = await this.store
      .query()
      .wherePartitionKey(tenantId)
      .whereSortKey()
      .beginsWith(`${id}`)
      .exec();

    const productModel = models.find((m) =>
      m.itemKey.startsWith(`${id}#${ModelType.PRODUCT}`)
    ) as ProductDataModel;

    if (!productModel) {
      return { success: false };
    }

    const imageModels = filterModels<ImageDataModel>(models, (m) =>
      m.itemKey.startsWith(`${id}#${ModelType.IMAGE}`)
    );

    const product = this.productMapper.mapToEntity(productModel, imageModels);

    return {
      success: true,
      item: product,
    };
  }

  search(
    tenantId: string,
    limit: number,
    search: string,
    cursor?: any
  ): Promise<BaseRepositoryResponse<Product[]>> {
    console.log(tenantId, limit, search, cursor);
    throw new Error('Method not implemented.');
  }

  async update(
    tenantId: string,
    id: string,
    update: Partial<Product>
  ): Promise<BaseRepositoryResponse<Product>> {
    const now = new Date().toISOString();

    const currentProductModel = (
      await this.store
        .query()
        .wherePartitionKey(tenantId)
        .whereSortKey()
        .beginsWith(`${ModelType.PRODUCT}#${id}`)
        .exec()
    )[0] as ProductDataModel;

    if (!currentProductModel) {
      return {
        success: false,
      };
    }

    const currentProduct = this.productMapper.mapToEntity(currentProductModel);

    const updatedImageModels = update.images?.map((img, i) =>
      this.imageMapper.mapToModel(img, {
        tenantId,
        productId: id,
        createdAt: currentProductModel.createdAt,
        updatedAt: now,
        index: i,
      })
    );

    const updatedProductModel = this.productMapper.mapToModel({
      ...currentProduct,
      ...update,
      updatedAt: now,
    });

    await this.store
      .batchWrite()
      .delete([currentProductModel])
      .put([updatedProductModel, ...(updatedImageModels ?? [])])
      .exec();

    const updatedProduct = this.productMapper.mapToEntity(
      updatedProductModel,
      updatedImageModels
    );

    return {
      success: true,
      item: updatedProduct,
    };
  }

  async delete(
    tenantId: string,
    id: string
  ): Promise<BaseRepositoryResponse<void>> {
    const { item } = await this.read(tenantId, id);

    if (!item) {
      return { success: false };
    }

    const productModel = this.productMapper.mapToModel(item);
    const imageModels = item.images?.map((img, i) =>
      this.imageMapper.mapToModel(img, {
        tenantId,
        productId: id,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        index: i,
      })
    );

    await this.store
      .batchWrite()
      .delete([productModel, ...(imageModels ?? [])])
      .exec();

    return {
      success: true,
    };
  }
}
