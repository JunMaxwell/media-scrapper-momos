## Getting Started
First clone this repository

## Preqrequisites
- Docker installed on your machine
- Setup a .env.development file in the UI direct of the project with the following variables
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key_here
NEXT_PUBLIC_API_URL=http://localhost:8080
NODE_OPTIONS='--inspect'
```

## Running the project
- Docker compose is used to run the project. To run the project, run the following command in the root directory of the project
```bash
npm run docker:up
```

## Stopping the project
- To stop the project, run the following command in the root directory of the project
```bash
npm run docker:down
```