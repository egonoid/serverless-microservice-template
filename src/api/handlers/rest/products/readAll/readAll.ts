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
import { eventLogger } from '@egonoid/api-middlewares';
import { IProductService } from '@application/services/interfaces/product.service';

export const readAll: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (!event.pathParameters) {
    return { statusCode: 400, body: '' };
  }

  const { tenantId } = event.pathParameters;
  const productService = container.get<IProductService>(Types.ProductService);
  const { item, error } = await productService.readAll(tenantId);

  if (!item) {
    return { statusCode: 400, body: JSON.stringify({ error }) };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ products: item }),
  };
};

export default middy(readAll).use(eventLogger()).use(cors());
