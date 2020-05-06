import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { BaseDataModel } from '@persistence/models/base.data';
import { Marshaller } from '@aws/dynamodb-auto-marshaller';
import { SortType } from '@common/enums/sortType.enum';
import { ProductStoreDataModel } from '@persistence/models';

const marshaller = new Marshaller();

export const batchPut = async (
  store: DynamoStore<ProductStoreDataModel>,
  models: ProductStoreDataModel[]
) => {
  for (let i = 0; i < models.length; i += 25) {
    await store
      .batchWrite()
      .put([...models.slice(i, i + 25)])
      .exec();
  }
};

export const batchDelete = async (
  store: DynamoStore<ProductStoreDataModel>,
  models: ProductStoreDataModel[]
) => {
  for (let i = 0; i < models.length; i += 25) {
    await store
      .batchWrite()
      .delete([...models.slice(i, i + 25)])
      .exec();
  }
};

export const filterModels = <TMODEL extends BaseDataModel>(
  models: BaseDataModel[],
  cb: (item: TMODEL) => boolean
): TMODEL[] => {
  return models.filter((m) => cb(m as TMODEL)) as TMODEL[];
};

export const createCursor = (item: ProductStoreDataModel): string => {
  const { tenantId, itemKey, sortKey: productSortKey } = item;
  const cursor = JSON.stringify(
    marshaller.marshallItem({ tenantId, itemKey, productSortKey })
  );

  return cursor;
};

export const sortModels = <T>(
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
