## Getting Started
First clone this repository

## Preqrequisites
- Docker installed on your machine

## Running the project
- Docker compose is used to run the project. To run the project, run the following command in the root directory of the project
```bash
npm run docker:up
```

- Seed the database with some data by running the following command in the root directory of the project, after the project has started
```bash
npm run seed
```

## Stopping the project
- To stop the project, run the following command in the root directory of the project
```bash
npm run docker:down
```