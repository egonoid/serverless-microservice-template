import { Image } from './image.entity';
import { BaseEntity } from './base.entity';

export interface Product extends BaseEntity {
  tenantId: string;
  name: string;
  description: string;
  shortDescription: string;
  subline: string;
  images?: Image[];
}
