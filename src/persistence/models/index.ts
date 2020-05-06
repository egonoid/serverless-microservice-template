import { ProductDataModel } from './product.data';
import { ImageDataModel } from './image.data';

export type ProductStoreDataModel = ProductDataModel | ImageDataModel;

export enum ModelType {
  PRODUCT = 'PRODUCT',
  IMAGE = 'IMAGE',
}

export const READ_ALL_INDEX = 'ReadAllIndex';
