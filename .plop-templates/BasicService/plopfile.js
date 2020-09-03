module.exports = [
  {
    type: 'add',
    path: 'src/application/services/interfaces/{{camelCase name}}.service.ts',
    templateFile:
      '.plop-templates/BasicService/template/application/services/interfaces/service.ts.hbs',
  },
  {
    type: 'add',
    path: 'src/application/services/{{camelCase name}}.service.ts',
    templateFile:
      '.plop-templates/BasicService/template/application/services/service.ts.hbs',
  },
];
