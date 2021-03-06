import {
  PartitionKey,
  SortKey,
  Model,
  GSIPartitionKey,
  GSISortKey,
} from '@shiftcoders/dynamo-easy';
import { ModelType, READ_ALL_INDEX } from '.';

@Model({ tableName: process.env.DYNAMO_DB_TABLE })
export class BaseDataModel {
  id: string;
  @PartitionKey()
  @GSIPartitionKey(READ_ALL_INDEX)
  tenantId: string;
  @SortKey() itemKey: string;
  @GSISortKey(READ_ALL_INDEX) sortKey: string;
  type: ModelType;
  createdAt: string;
  updatedAt: string;
}
