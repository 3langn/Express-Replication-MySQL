# Todo

# Steps to run this project:

## Start

1. Run `npm install` command
2. Setup database settings inside `ormconfig.js` file
   - username : [ your database username ]
   - password : [ your database password ]
3. Run `npm run tsoa:generate` to generate swagger folder
4. Create MySQL database name todo
5. Run `npm start` command

## Docker

Run ./build.sh

## API Documentation

To view the list of available APIs and their specifications, run the server and go to `http://localhost:3001/v1/docs` in your browser. This documentation page is automatically generated using the [swagger](https://swagger.io/) definitions written as comments in the route files.

CREATE USER 'root'@'%' IDENTIFIED BY 'mypass'; GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
