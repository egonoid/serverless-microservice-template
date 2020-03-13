import * as yup from 'yup';
import { validate } from './validator';

const model = {
  company: 'Super Inc.',
  email: 'test@example.com',
  malicious: 'Im unwanted...',
  firstName: 'Marc',
  lastName: 'Miller',
  street: 'Millerstreet. 27',
  zipCode: '12345',
  city: 'Example City',
  country: 'Tryout Country',
  age: 18,
};

const unitTestSchema = yup.object({
  type: yup.mixed<'person' | 'company'>().oneOf(['person', 'company']),
  company: yup
    .string()
    .required()
    .min(3, 'Company has minimum length of 3 letters.')
    .max(100, 'Company has maximum length of 100 letters.'),
  firstName: yup
    .string()
    .required('Entering a first name is required.')
    .min(3, 'First name has minimum length of 3 letters.')
    .max(100, 'First name has maximum length of 100 letters.'),
  lastName: yup
    .string()
    .required('Entering a last name is required.')
    .min(3, 'Last name has minimum length of 3 letters.')
    .max(100, 'Last name has maximum length of 100 letters.'),
  email: yup
    .string()
    .required('Entering an email is required.')
    .email('Please enter a valid email address.'),
  street: yup.string().required('Entering a street is required.'),
  streetNumber: yup.string(),
  zipCode: yup.string().required('Entering a zip code is required.'),
  city: yup.string().required('Entering a city is required.'),
  country: yup.string().required('Entering a country is required.'),
  state: yup.string(),
  phone: yup.string(),
  age: yup
    .number()
    .required()
    .min(18)
    .max(99),
});

type UnitTestModel = yup.InferType<typeof unitTestSchema>;

describe('validate UnitTestModel', () => {
  it('should validate without error', async () => {
    // Arrange
    const item = {
      ...model,
    };

    // Act
    const result = await validate<UnitTestModel>(
      JSON.stringify(item),
      unitTestSchema
    );

    // Assert
    expect(result).toBeTruthy();
  });

  it('should throw exception on email address', async () => {
    // Arrange
    const item = {
      ...model,
      email: 'test@example.com!',
    };

    expect.assertions(1);

    try {
      // Act
      await validate<UnitTestModel>(JSON.stringify(item), unitTestSchema);
    } catch (err) {
      // Assert
      expect(err).toMatchSnapshot();
    }
  });

  it('should throw exception on too short firstname', async () => {
    // Arrange
    const item = {
      ...model,
      firstName: 'An',
    };

    expect.assertions(1);

    try {
      // Act
      await validate<UnitTestModel>(JSON.stringify(item), unitTestSchema);
    } catch (err) {
      // Assert
      expect(err).toMatchSnapshot();
    }
  });

  it('should throw exception on too long firstname', async () => {
    // Arrange
    const item = {
      ...model,
      firstName:
        '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901',
    };

    expect.assertions(1);

    try {
      // Act
      await validate<UnitTestModel>(JSON.stringify(item), unitTestSchema);
    } catch (err) {
      // Assert
      expect(err).toMatchSnapshot();
    }
  });

  it('should throw exception on number to low', async () => {
    // Arrange
    const item = {
      ...model,
      age: 17,
    };

    expect.assertions(1);

    try {
      // Act
      await validate<UnitTestModel>(JSON.stringify(item), unitTestSchema);
    } catch (err) {
      // Assert
      expect(err).toMatchSnapshot();
    }
  });
});
