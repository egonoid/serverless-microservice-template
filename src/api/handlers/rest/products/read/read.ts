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

export const read: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (!event.pathParameters) {
    return { statusCode: 400, body: '' };
  }

  const { tenantId, id } = event.pathParameters;
  const productService = container.get<IProductService>(Types.ProductService);
  const { item, error } = await productService.read(tenantId, id);

  if (!item) {
    switch (error) {
      case 'NOT_FOUND':
        return { statusCode: 404, body: JSON.stringify({ error }) };
      default:
        return { statusCode: 400, body: JSON.stringify({ error }) };
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ products: item }),
  };
};

export default middy(read).use(eventLogger()).use(cors());
