# Node & Express REST API, with Mongo Docker template

- Yarn is used as package manager
- It's setup to use Typescript (not plain old js)
- Nodemon is used to monitor the changes within the container.
- Eslint is used to prettify the code source.
- Husky is used to setup git hooks.

This project also comes with pre-implement usefull feature, like :

- User signup and login, authentication is built using JWT.
- Roles and permissions endpoint, to ensure role based authorization

## Unit tests

- Jest is used as test runner.
- Supertest is used to test the app's endpoints.

Just type "yarn test" and the unit tests will run.

This project comes with pre implemented login / signup using JWT.

## Git hooks and Husky

There is a pre-commit hook configured to ensure everything that is commited build, lint and pass the tests.
Any failure in these steps would not result in a successful commit.
