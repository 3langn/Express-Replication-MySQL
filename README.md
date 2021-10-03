# Todo

# Steps to run this project:

## Start

1. Run `yarn install` command
2. Setup database settings inside `ormconfig.json` file
   - username : [ your database username ]
   - password : [ your database password ]
3. Run `yarn run tsoa:generate` to generate swagger folder
4. Create MySQL database name todo
5. Run `yarn start` command

## API Documentation

To view the list of available APIs and their specifications, run the server and go to `http://localhost:8080/v1/docs` in your browser. This documentation page is automatically generated using the [swagger](https://swagger.io/) definitions written as comments in the route files.

