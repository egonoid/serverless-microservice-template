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

      const { schema, payloadSelector } = config;
      const body = JSON.parse(handler.event.body);
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
              message: 'Invalid request.',
              errors: err.errors,
            }),
          })
        );
    },
  };
};

export default bodyValidator;
