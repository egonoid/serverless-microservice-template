import { Product } from '@domain/product.entity';
import { ProductDataModel } from '../models/product.data';
import { ModelType } from '@persistence/models/base.data';
import { ImageDataModel } from '@persistence/models/image.data';
import { ImageMapper } from './image.mapper';
import { BaseMapper } from '@common/baseMapper';
import { injectable, inject } from 'inversify';
import { DITypes } from '@common/dependency-injection';

@injectable()
export class ProductMapper extends BaseMapper<
  Product,
  ProductDataModel,
  void,
  ImageDataModel[]
> {
  constructor(@inject(DITypes.ImageMapper) private imageMapper: ImageMapper) {
    super();
  }

  mapToEntity(model: ProductDataModel, data?: ImageDataModel[]): Product {
    return {
      id: model.productId,
      tenantId: model.tenantId,
      description: model.description,
      name: model.name,
      shortDescription: model.shortDescription,
      subline: model.subline,
      images:
        data && data.length > 0
          ? data.map(img => this.imageMapper.mapToEntity(img))
          : undefined,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }

  mapToModel(entity: Product): ProductDataModel {
    return {
      productId: entity.id,
      tenantId: entity.tenantId,
      description: entity.description,
      name: entity.name,
      shortDescription: entity.shortDescription,
      subline: entity.subline,
      type: ModelType.PRODUCT,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      productKey: `${ModelType.PRODUCT}#${entity.id}#${entity.updatedAt}`,
    };
  }
}
