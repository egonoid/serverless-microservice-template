import { IRepository } from './repository';
import { Product } from '@domain/product.entity';

export interface IProductRepository extends IRepository<Product> {}
