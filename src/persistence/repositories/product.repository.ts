import { BaseRepositoryResponse } from './interfaces/repository';
import { Product } from '@domain/product.entity';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { ProductDataModel } from '@persistence/models/product.data';
import { inject, injectable } from 'inversify';
import { ModelType } from '@persistence/models/base.data';
import { ImageDataModel } from '@persistence/models/image.data';
import { IProductRepository } from './interfaces/product.repository';
import { DITypes } from '@common/dependency-injection';
import { ProductMapper } from '@persistence/mappers/product.mapper';
import { ImageMapper } from '@persistence/mappers/image.mapper';
import { EntityPartial } from '@domain/base.entity';

@injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @inject(DITypes.DatabaseStore)
    private store: DynamoStore<ProductDataModel | ImageDataModel>,
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
    cursor?: any
  ): Promise<BaseRepositoryResponse<Product[]>> {
    const productModels = (await this.store
      .query()
      .wherePartitionKey(tenantId)
      .whereSortKey()
      .beginsWith(`${ModelType.PRODUCT}`)
      .exclusiveStartKey(cursor)
      .limit(limit)
      .descending()
      .exec()) as ProductDataModel[];

    const products = productModels.map(model =>
      this.productMapper.mapToEntity(model)
    );

    return {
      success: true,
      item: products,
    };
  }

  async read(
    tenantId: string,
    id: string
  ): Promise<BaseRepositoryResponse<Product>> {
    const productModelsPromise = this.store
      .query()
      .wherePartitionKey(tenantId)
      .whereSortKey()
      .beginsWith(`${ModelType.PRODUCT}`)
      .exec() as Promise<ProductDataModel[]>;

    const imageModelsPromise = this.store
      .query()
      .wherePartitionKey(tenantId)
      .whereSortKey()
      .beginsWith(`${ModelType.IMAGE}#${id}`)
      .ascending()
      .exec() as Promise<ImageDataModel[]>;

    const [productModels, imageModels] = await Promise.all([
      productModelsPromise,
      imageModelsPromise,
    ]);

    const product = productModels[0]
      ? this.productMapper.mapToEntity(productModels[0], imageModels)
      : undefined;

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
