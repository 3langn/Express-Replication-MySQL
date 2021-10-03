const { generateRoutes, generateSpec } = require('tsoa');

(async () => {
  const specOptions = {
    basePath: '/',
    entryFile: 'src/app.ts',
    noImplicitAdditionalProperties: 'throw-on-extras',
    controllerPathGlobs: ['src/**/*.router.ts'],
    outputDirectory: 'swagger',
    specVersion: 3,
    schemes: ['http', 'https'],
    securityDefinitions: {
      jwt: {
        type: 'apiKey',
        name: 'x-access-token',
        in: 'header',
      },
    },
  };

  const routeOptions = {
    authenticationModule: 'src/middleware/auth.ts',
    middleware: 'express',
    basePath: '/',
    entryFile: 'src/app.ts',
    noImplicitAdditionalProperties: 'throw-on-extras',
    controllerPathGlobs: ['src/**/*.router.ts'],
    routesDir: 'swagger',
  };

  await generateSpec(specOptions);
  await generateRoutes(routeOptions);
})();
