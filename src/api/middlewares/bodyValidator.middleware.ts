import { Middleware } from 'middy';
import { validate } from '@api/validators/validator';
import { ObjectSchema } from 'yup';

const bodyValidator: Middleware<
  { schema: ObjectSchema; payloadSelector?: string },
  any,
  any
> = config => {
  return {
    before: (handler, next) => {
      if (!config?.schema) {
        throw new Error('Schema is missing.');
      }

      let body;

      try {
        body = JSON.parse(handler.event.body);
      } catch {
        return handler.callback(null, {
          statusCode: 400,
          body: JSON.stringify({ message: 'INVALID_REQUEST' }),
        });
      }

      const { schema, payloadSelector } = config;
      const payload = payloadSelector ? body[payloadSelector] : body;

      validate(payload, schema)
        .then(model => {
          handler.event.model = model;
          next();
        })
        .catch(err =>
          handler.callback(null, {
            statusCode: 400,
            body: JSON.stringify({
              message: 'INVALID_REQUEST',
              errors: err.errors,
            }),
          })
        );
    },
  };
};

export default bodyValidator;
