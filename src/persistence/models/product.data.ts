import { Model } from '@shiftcoders/dynamo-easy';
import { BaseDataModel } from './base.data';

@Model({ tableName: process.env.DYNAMO_DB_TABLE })
export class ProductDataModel extends BaseDataModel {
  name: string;
  description: string;
  shortDescription: string;
  subline: string;
}
