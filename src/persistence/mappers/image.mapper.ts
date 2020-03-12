import { Image } from '@domain/image.entity';
import { ModelType } from '@persistence/models/base.data';
import { ImageDataModel } from '@persistence/models/image.data';
import { BaseMapper } from '@common/baseMapper';
import { injectable } from 'inversify';

@injectable()
export class ImageMapper extends BaseMapper<
  Image,
  ImageDataModel,
  AdditionalImageEntityData,
  void
> {
  mapToEntity(model: ImageDataModel): Image {
    return {
      id: model.imageId,
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
      productId,
      tenantId,
      imageId: entity.id,
      originId: entity.originId,
      ext: entity.ext,
      type: ModelType.IMAGE,
      productKey: `${ModelType.IMAGE}#${productId}#${index}`,
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
