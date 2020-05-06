import { Image } from '@domain/image.entity';
import { ImageDataModel } from '@persistence/models/image.data';
import { BaseMapper } from '@common/baseMapper';
import { injectable } from 'inversify';
import { ModelType } from '@persistence/models';

@injectable()
export class ImageMapper extends BaseMapper<
  Image,
  ImageDataModel,
  AdditionalImageEntityData,
  void
> {
  mapToEntity(model: ImageDataModel): Image {
    return {
      id: model.id,
      originId: model.originId,
      ext: model.ext,
    };
  }

  mapToModel(entity: Image, data?: AdditionalImageEntityData): ImageDataModel {
    if (!data) {
      throw new Error('Data is missing.');
    }

    const { productId, tenantId, index, createdAt, updatedAt } = data;

    return {
      tenantId,
      id: entity.id,
      originId: entity.originId,
      ext: entity.ext,
      type: ModelType.IMAGE,
      itemKey: `${productId}#${ModelType.IMAGE}#${index}`,
      sortKey: `${ModelType.IMAGE}#${updatedAt}#${entity.id}`,
      productId,
      createdAt,
      updatedAt,
    };
  }
}

export interface AdditionalImageEntityData {
  tenantId: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
  index: number;
}
