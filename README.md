# Creating a New Nodejs Application and Docker Container
In the terminal, create a new directory and go to it.
```
mkdir ihme-app && cd ihme-app
```

Initialize `git` and `npm`.
```
git init
npm init
```

We'll run a node.js server using express, so add the following to `package.json` file.
```
"scripts": {
"start": "node server.js"
},
```
and then
```
npm install --save express
```

We don't want to publish unnecessary files so create a `.gitignore` file and ignore the following files:
```
node_modules
.DS_Store
npm-debug.log
dist
bundle.js
.idea
```

Now we create the `server.js` file.
```
touch server.js
```
`server.js` content:
```javascript
'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello world\n');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
```

We will run this application in a Docker container. Create a `Dockerfile`.
```
mkdir Docker
mkdir Docker/dev
touch Docker/dev/Dockerfile
```
`Dockerfile` content:
```
FROM node:carbon

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]
```

Create a `dockerignore` file to prevent your local modules and debug logs from being copied onto your Docker image.
```
touch .dockerignore
```
`dockerignore` content:
```
node_modules
npm-debug.log
```

Add these scripts to `package.json` file:
```
    "docker:build:dev": "docker build -t starter-app -f ./Docker/dev/Dockerfile .",
    "docker:run": "docker run --rm --publish 11235:8080 --name starter-app -e ENVIRONMENT_NAME='dev' starter-app"

```

You can use `npm run docker:build:dev` to build the image. Then to run the image use the script `npm run docker:run`.

Now we can call the app using `curl -i localhost:11235`.

Resource: [nodejs.org](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

# Nodejs Sever Using Typescript
To get started with typescript we will
```
npm install --save typescript
```

We will also install the typings for node:
```
npm install --save @types/node
```

We will create `app.ts` file to implement our server. We'll put it in a directory called `server`.
```
mkdir server
touch server/app.ts
```
`app.ts` content:
```typescript
import * as express from 'express'

class App {
  public express

  constructor () {
    this.express = express()
    this.mountRoutes()
  }

  private mountRoutes (): void {
    const router = express.Router()
    router.get('/', (req, res) => {
      res.json({
        message: 'Hello World!'
      })
    })
    this.express.use('/', router)
  }
}

export default new App().express
```

We are also creating an `index.ts` file, so the web server can be fired up:
```
touch server/index.ts
```
`index.ts` content:
```typescript
import app from './App'

const port = process.env.PORT || 8080

app.listen(port, (err) => {
  if (err) {
    return console.log(err)
  }

  return console.log(`server is listening on ${port}`)
})
```

We add a configuration file for typescript `tsconfig.json` to tell typescript what to do.
```
touch tsconfig.json
```
`tsconfig.json` content: 
```
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "./dist/",
    "sourceMap": true
  },
  "files": [
    "./node_modules/@types/node/index.d.ts"
  ],
  "include": [
    "server/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

To compile our typescript down to javascript we will include a script in out package.json.
```
"tsc": "tsc"
```

Make the following change to `Dockerfile`:
```
FROM node:carbon

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 8080

CMD [ "node", "dist" ]
```
and `package.json`:
```
{
  "name": "ihme-app",
  "version": "1.0.0",
  "description": "starter app",
  "main": "index.js",
  "scripts": {
    "docker:build:dev": "docker build -t starter-app -f ./Docker/dev/Dockerfile .",
    "docker:run": "docker run --rm --publish 11235:8080 --name starter-app -e ENVIRONMENT_NAME='dev' starter-app",
    "tsc": "tsc"
  },
  "author": "Aaron Keel",
  "license": "ISC",
  "dependencies": {
    "@types/node": "^8.5.2",
    "express": "^4.16.2",
    "typescript": "^2.6.2"
  }
}
```

After building and running the docker container you can test the server using `curl -i localhost:11235`.

Resource: [Building a Node.js App with TypeScript Tutorial](https://blog.risingstack.com/building-a-node-js-app-with-typescript-tutorial/)
