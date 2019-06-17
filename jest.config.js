module.exports = {
  testRegex: '.+\\.test\\.ts$',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
};
