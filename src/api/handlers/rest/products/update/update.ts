import 'reflect-metadata';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
import 'source-map-support/register';
import * as Types from '@common/dependency-injection/types';
import container from '@common/dependency-injection/container';
import middy from 'middy';
import { cors } from 'middy/middlewares';
import { IProductService } from '@application/services/interfaces/product.service';
import { eventLogger, bodyValidator } from '@egonoid/api-middlewares';
import { productModelSchema } from '@api/models/product.model';
import { handleError } from '@api/extensions/error.extensions';

export const update: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (!event.body || !event.pathParameters?.tenantId) {
    return { statusCode: 400, body: '' };
  }

  const product = (event as any).model;
  const { tenantId, id } = event.pathParameters;
  const productService = container.get<IProductService>(Types.ProductService);
  const { item, error } = await productService.update({
    ...product,
    tenantId,
    id,
  });

  if (!item) {
    return handleError(error);
  }

  return { statusCode: 200, body: JSON.stringify({ product: item }) };
};

export default middy(update)
  .use(eventLogger())
  .use(
    bodyValidator({ schema: productModelSchema, payloadSelector: 'product' })
  )
  .use(cors());
