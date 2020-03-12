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

export const create: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (!event.body || !event.pathParameters?.tenantId) {
    return { statusCode: 400, body: '' };
  }

  const { product } = JSON.parse(event.body);
  const { tenantId } = event.pathParameters;
  const productService = container.get<IProductService>(Types.ProductService);
  const { item, error } = await productService.create({ ...product, tenantId });

  if (!item) {
    return { statusCode: 400, body: JSON.stringify({ error }) };
  }

  return { statusCode: 200, body: JSON.stringify({ product: item }) };
};

export default middy(create)
  // .use(eventLogger())
  .use(cors());
