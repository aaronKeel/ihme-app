# Creating a New Nodejs Application and Docker Container

In the terminal, create a new directory and go to it.
```text
mkdir ihme-app && cd ihme-app
```

Initialize `git` and `npm`.
```text
git init
npm init
```

We'll run a node.js server using express, so add the following to `package.json` file.
```json
"scripts": {
"start": "node server.js"
},
```
and then
```text
npm install --save express
npm install --save @types/express
```

We don't want to publish unnecessary files so create a `.gitignore` file and ignore the following files:
```text
node_modules
.DS_Store
npm-debug.log
dist
bundle.js
.idea
```

Now we create the `server.js` file.
```text
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
```text
mkdir Docker
mkdir Docker/dev
touch Docker/dev/Dockerfile
```
`Dockerfile` content:
```text
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
```text
touch .dockerignore
```
`dockerignore` content:
```text
node_modules
npm-debug.log
```

Add these scripts to `package.json` file:
```json
    "docker:build:dev": "docker build -t starter-app -f ./Docker/dev/Dockerfile .",
    "docker:run": "docker run --rm --publish 8080:8080 --name starter-app -e ENVIRONMENT_NAME='dev' starter-app"

```

You can use `npm run docker:build:dev` to build the image. Then to run the image use the script `npm run docker:run`.

Now we can call the app using `curl -i localhost:8080`.

Resource: [nodejs.org](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

# Nodejs Sever Using Typescript

To get started with typescript we will
```text
npm install --save typescript
```

We will also install the typings for node:
```text
npm install --save @types/node
```

We will create `app.ts` file to implement our server. We'll put it in a directory called `server`.
```text
mkdir server
touch server/app.ts
```
`app.ts` content:
```typescript
import * as express from 'express';

class App {
  public express;

  constructor () {
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes (): void {
    const router = express.Router();
    
    router.get('/', (req, res) => {
      res.json({
        message: 'Hello World!',
      });
    });
    
    this.express.use('/', router);
  }
}

export default new App().express;
```

We are also creating an `index.ts` file, so the web server can be fired up:
```
touch server/index.ts
```
`index.ts` content:
```typescript
import app from './App';

const port = process.env.PORT || 8080;

app.listen(port, (err) => {
  if (err) {
    return console.log(err);
  }

  return console.log(`server is listening on ${port}`);
});
```

We add a configuration file for typescript `tsconfig.json` to tell typescript what to do.
```text
touch tsconfig.json
```
`tsconfig.json` content: 
```json
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
```json
"tsc": "tsc"
```

Make the following change to `Dockerfile`:
```text
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
```json
{
  "name": "ihme-app",
  "version": "1.0.0",
  "description": "starter app",
  "main": "index.js",
  "scripts": {
    "docker:build:dev": "docker build -t starter-app -f ./Docker/dev/Dockerfile .",
    "docker:run": "docker run --rm --publish 8080:8080 --name starter-app -e ENVIRONMENT_NAME='dev' starter-app",
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

Build and run:
```text
npm run tsc
npm run docker:build:dev
npm run docker:run
```

After building and running the docker container you can test the server using `curl -i localhost:8080`.

Resource: [Building a Node.js App with TypeScript Tutorial](https://blog.risingstack.com/building-a-node-js-app-with-typescript-tutorial/)

We can remove `server.js`.

# Serving Static Files in Express

Create a `public` directory to hold all of our public facing code:
```text
mkdir public
```
We will need to use Express middleware to serve static files. Edit `index.ts` in the sever directory:
```typescript
import * as express from 'express';
import * as path from 'path';

class App {
  public express;

  constructor () {
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes (): void {
    const router = express.Router();

    router.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '/../public/index.html'));
    });

    router.get('/api', (req, res) => {
      res.json({
        message: 'Hello World!',
      });
    });

    this.express.use('/', router);
    this.express.use('/api', router);
    this.express.use('/public', express.static(path.join(__dirname, '/../public')));
  }
}

export default new App().express;
```

Create `index.html` and `style.css` files in public the directory:
```text
touch public/index.html
touch public/style.css
```
`index.html` content:
```html
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <title>IHME App</title>
        <link rel="stylesheet" href="/public/style.css">
    </head>
    <body>
        <main id="page">
            IHME App
        </main>
    </body>
</html>
```
`style.css` content:
```css
main {
    font-family: Helvetica, sans-serif;
}
```
Resources:
-   [Serving static files in Express](http://expressjs.com/en/starter/static-files.html)
-   [Use ExpressJS to Deliver HTML Files](https://scotch.io/tutorials/use-expressjs-to-deliver-html-files)