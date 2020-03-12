import { Container, decorate, injectable } from 'inversify';
import * as Types from './types';
import { IPingService } from '../../application/services/interfaces/ping.service';
import PingService from '../../application/services/ping.service';
import { SNS } from 'aws-sdk';
import EventService from '../../application/services/event.service';
import { IEventService } from '../../application/services/interfaces/event.service';
import { ProductMapper } from '@persistence/mappers/product.mapper';
import { ImageMapper } from '@persistence/mappers/image.mapper';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { ProductDataModel } from '@persistence/models/product.data';
import { ImageDataModel } from '@persistence/models/image.data';
import { IProductRepository } from '@persistence/repositories/interfaces/product.repository';
import { ProductRepository } from '@persistence/repositories/product.repository';

const container = new Container({ skipBaseClassChecks: true });

container.bind<IPingService>(Types.PingService).to(PingService);
container.bind<IEventService>(Types.EventService).to(EventService);
container.bind<ProductMapper>(Types.ProductMapper).toSelf();
container.bind<ImageMapper>(Types.ImageMapper).toSelf();

decorate(injectable(), SNS);
container.bind<SNS>(SNS).to(SNS);

decorate(injectable(), DynamoStore);
container
  .bind<DynamoStore<ProductDataModel | ImageDataModel>>(Types.DatabaseStore)
  .toConstantValue(
    new DynamoStore<ProductDataModel | ImageDataModel>(ProductDataModel)
  );

container
  .bind<IProductRepository>(Types.ProductRepository)
  .to(ProductRepository);

export default container;
