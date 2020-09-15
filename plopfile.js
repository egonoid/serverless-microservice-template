const basicServiceActions = require('./.plop-templates/BasicService/plopfile');

module.exports = function (plop) {
  plop.setGenerator('BasicService', {
    description: 'Create a Basic Service',
    prompts: [
      {
        type: `input`,
        name: `name`,
        message: `Name of the service:`,
      },
    ],
    actions: basicServiceActions,
  });
};
