import { PartitionKey, SortKey, Model } from '@shiftcoders/dynamo-easy';

@Model({ tableName: process.env.DYNAMO_DB_TABLE })
export class BaseDataModel {
  @PartitionKey() tenantId: string;
  @SortKey() productKey: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
  type: ModelType;
}

export enum ModelType {
  PRODUCT = 'PRODUCT',
  IMAGE = 'IMAGE',
}
