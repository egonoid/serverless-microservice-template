export interface BaseEntity {
  id: string;
  updatedAt: string;
  createdAt: string;
}

export type EntityPartial<T extends BaseEntity> = Omit<
  T,
  'createdAt' | 'updatedAt'
>;
