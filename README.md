# Image Processing API

## Description

This is an image processing API that is a project required for the udacity Full-Stack Web Developer Nanodegree program, the course named "Image Processing API".

## Setup and Dependencies used to build this project

```bash
npm init -y
npm i typescript express
npm i -D @types/express @types/node nodemon eslint jasmine jasmine-spec-reporter supertest ts-node-dev
```

## File Structure

```
Image Processing API/
├── .git/
├── .vscode/
├── dist/
├── node_modules/
├── resources/
├── spec/
│   └── support/
│       └── jasmine.json
├── src/
│   ├── routes/
│   │   ├── api/
│   │   │   └── images.ts
│   │   └── router.ts
│   ├── tests/
│   │   ├── helpers/
│   │   │   └── reporter.ts
│   │   └── images.spec.ts
│   └── server.ts
├── .gitignore
├── .prettierrc
├── eslint.config.json
├── nodemon.json
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```

## Scripts

| Script           | Description                |
|:-----------------|:---------------------------|
| `npm run dev`    | Run the development server |
| `npm run test`   | Run the tests              |
| `npm run lint`   | Run the linter             |
| `npm run format` | Run the formatter          |
| `npm run build`  | Run the build              |
| `npm run start`  | Run the production server  |