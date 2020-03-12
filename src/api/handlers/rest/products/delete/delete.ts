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
import eventLogger from '@api/middlewares/eventLogger.middleware';

export const del: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (!event.pathParameters?.tenantId) {
    return { statusCode: 400, body: '' };
  }

  const { tenantId, id } = event.pathParameters;
  const productService = container.get<IProductService>(Types.ProductService);

  await productService.delete(tenantId, id);

  return { statusCode: 200, body: '' };
};

export default middy(del)
  .use(eventLogger())
  .use(cors());
