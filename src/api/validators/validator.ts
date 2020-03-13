import { ObjectSchema, ValidateOptions, ValidationError } from 'yup';

export const validate = async <T>(
  item: string,
  schema: ObjectSchema,
  options?: ValidateOptions
): Promise<T> => {
  if (!options) {
    options = {
      abortEarly: false,
      stripUnknown: true,
    };
  }

  const result = schema
    .validate(item, options)
    .then(value => {
      return value as Promise<T>;
    })
    .catch((err: ValidationError) => {
      if (err && err.inner) {
        const errors: any[] = [];
        err.inner.forEach(error => {
          const source = error.path;
          const type = getErrorType(error.value, error.type);
          const message = getErrorMessage(source, type, error.params);

          const newError = {
            source,
            type,
            message,
          };

          errors.push(newError);
        });

        throw { errors };
      }
      throw err;
    });

  return result;
};

const getErrorType = (value: string | number, type: string) => {
  if (typeof value === 'undefined') {
    switch (type) {
      case 'required':
        return 'ERROR_VALIDATION_REQUIRED';
    }
  }

  if (typeof value === 'string') {
    switch (type) {
      case 'min':
        return 'ERROR_VALIDATION_MIN_STRING';
      case 'max':
        return 'ERROR_VALIDATION_MAX_STRING';
      case 'email':
        return 'ERROR_VALIDATION_EMAIL';
    }
  }

  if (typeof value === 'number') {
    switch (type) {
      case 'min':
        return 'ERROR_VALIDATION_MIN_NUMBER';
      case 'max':
        return 'ERROR_VALIDATION_MAX_NUMBER';
    }
  }

  return 'ERROR_VALIDATION_UNKNOWN';
};

// inspired by https://github.com/jquense/yup/blob/master/src/locale.js
const getErrorMessage = (source: string, type: string, params: any) => {
  source = source.charAt(0).toUpperCase() + source.slice(1);

  switch (type) {
    case 'ERROR_VALIDATION_REQUIRED':
      return `${source} is a required field.`;
    case 'ERROR_VALIDATION_MIN_STRING':
      return `${source} must be at least ${params.min} characters long.`;
    case 'ERROR_VALIDATION_MAX_STRING':
      return `${source} cannot exceed ${params.max} characters.`;
    case 'ERROR_VALIDATION_EMAIL':
      return `${source} is not a valid email address.`;
    case 'ERROR_VALIDATION_MIN_NUMBER':
      return `${source} must be greater than or equal to ${params.min}.`;
    case 'ERROR_VALIDATION_MAX_NUMBER':
      return `${source} must be less than or equal to ${params.max}.`;
    default:
      return `${source} is invalid.`;
  }
};
