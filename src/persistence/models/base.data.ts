import {
  PartitionKey,
  SortKey,
  Model,
  GSIPartitionKey,
} from '@shiftcoders/dynamo-easy';

@Model({ tableName: process.env.DYNAMO_DB_TABLE })
export class BaseDataModel {
  @PartitionKey()
  @GSIPartitionKey('ProductIndex')
  tenantId: string;
  @SortKey() productKey: string;
  createdAt: string;
  updatedAt: string;
  type: ModelType;
}

export enum ModelType {
  PRODUCT = 'PRODUCT',
  IMAGE = 'IMAGE',
}
