# Nest Hackathon Starter <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" height="28px" alt="Nest Logo"/></a>


This project contains boilerplate for creating APIs using [Nest](https://nestjs.com), a progressive [Node.js](http://nodejs.org) framework for building efficient and scalable server-side applications.

It is mostly built to be used as a starting point in hackathons and implements common operations such as sign up, JWT authentication, mail validation, model validation and database access.

## Features

1. **PostgreSQL with Prisma**

2. **JWT Authentication**

3. **Mail Verification**

4. **Mail Change**

5. **Password Reset**

6. **Request Validation**

7. **Customizable Mail Templates**

8. **Swagger API Documentation**

9. **Security Techniques**

10. **Logger**

## Getting Started

### Installation

1. Make sure that you have [Node.js](https://nodejs.org)(>= 10.13.0 and <= v14.21.3, except for v13) installed.
2. Clone this repository
3. Move to the appropriate directory: `cd <YOUR_PROJECT_NAME>`.
4. Run `npm` to install dependencies.

### Configuration Files

#### [Prisma](https://github.com/prisma/prisma) Configurations

This template uses Postgres by default. If you want to use another database, follow instructions in the [official Nest recipe on Prisma](https://docs.nestjs.com/recipes/prisma).

If you wish to use another database you will also have to edit the connection string on [`prisma/.env`](prisma/.env) file accordingly.

Template includes three different environment options by default. Most of the time you will use the `local`
environment when developing and `production` environment on production. You will need to fill out corresponding
environment files in [`env`](env) directory.

```dosini
DATABASE_HOST=__YOUR_DATABASE_URL__
DATABASE_PORT=5432
DATABASE_USERNAME=__YOUR_USERNAME__
DATABASE_PASSWORD=__YOUR_PASSWORD__
DATABASE_NAME=__YOUR_DATABASE__
```

#### JWT Configurations

A secret key is needed in encryption process. Generate a secret key using a service like [randomkeygen](https://randomkeygen.com/).

Enter your secret key to [`config.ts`](src/config.ts) file. You can also the change expiration time, default is 86400 seconds(1 day).

```js
  jwt: {
    secretOrKey: '__JWT_SECRET_KEY__',
    expiresIn: 86400,
  },
```

### Migrations

Please refer to the official [Prisma Migrate Guide](https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate) to get more info about Prisma migrations.

```bash
# generate migration for local environment
$ npm run migrate:dev:create
# run migrations in local environment
$ npm run migrate:dev

# deploy migration to prod environment
$ npm run migrate:deploy:prod
```

### Running the app

```bash
# development mode
$ npm run start:dev

# production
$ npm run build
$ npm run start:prod
```

### Running the tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support Nest

Nest is an MIT-licensed open source project. If you'd like to join support Nest, please [read more here](https://docs.nestjs.com/support).

## License

Licenced under [MIT License](LICENSE). Nest is also MIT licensed.
