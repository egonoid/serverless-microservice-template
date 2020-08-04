import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { BaseDataModel } from '@persistence/models/base.data';
import { Marshaller } from '@aws/dynamodb-auto-marshaller';
import { SortType } from '@common/enums/sortType.enum';

const marshaller = new Marshaller();

export const batchPut = async <T extends BaseDataModel>(
  store: DynamoStore<T>,
  models: T[]
) => {
  for (let i = 0; i < models.length; i += 25) {
    await store
      .batchWrite()
      .put([...models.slice(i, i + 25)])
      .exec();
  }
};

export const batchDelete = async <T extends BaseDataModel>(
  store: DynamoStore<T>,
  models: T[]
) => {
  for (let i = 0; i < models.length; i += 25) {
    await store
      .batchWrite()
      .delete([...models.slice(i, i + 25)])
      .exec();
  }
};

export const filterModels = <T extends BaseDataModel>(
  models: BaseDataModel[],
  cb: (item: T) => boolean
): T[] => {
  return models.filter((m) => cb(m as T)) as T[];
};

export const createCursor = <T extends BaseDataModel>(item: T): string => {
  const { tenantId, itemKey, sortKey } = item;
  const cursor = JSON.stringify(
    marshaller.marshallItem({ tenantId, itemKey, sortKey })
  );

  return cursor;
};

export const sortModels = <T extends BaseDataModel>(
  models: T[],
  sortProperty: keyof T,
  sortType: SortType
): T[] => {
  return models.sort((m1, m2) =>
    m1[sortProperty] > m2[sortProperty]
      ? sortType === SortType.ASC
        ? 1
        : -1
      : m1[sortProperty] < m2[sortProperty]
      ? sortType === SortType.ASC
        ? -1
        : 1
      : 0
  );
};
