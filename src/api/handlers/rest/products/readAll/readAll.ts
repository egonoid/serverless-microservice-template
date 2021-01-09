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
import { handleError } from '@api/extensions/error.extensions';
import { SortType } from '@common/enums/sortType.enum';

export const readAll: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (!event.pathParameters?.tenantId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'INVALID_REQUEST' }),
    };
  }

  const { tenantId } = event.pathParameters;
  const { limit: limitParam, before, after, search, sort: sortParam } =
    event.queryStringParameters ?? {};
  const productService = container.get<IProductService>(Types.ProductService);
  const limit = limitParam ? parseFloat(limitParam) : undefined;

  if (limitParam && !limit) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'INVALID_REQUEST' }),
    };
  }

  const sort: SortType | undefined =
    sortParam === 'ASC'
      ? SortType.ASC
      : sortParam === 'DESC'
      ? SortType.DESC
      : undefined;

  const { item, startCursor, endCursor, error } = await productService.readAll(
    tenantId,
    limit,
    sort,
    after,
    before,
    search
  );

  if (!item) {
    return handleError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ products: item, startCursor, endCursor }),
  };
};

export default middy(readAll).use(eventLogger()).use(cors());
