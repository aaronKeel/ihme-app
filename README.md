# Creating a New Web Application
In terminal, create a new directory and go to it.
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

Include the following in the Dockerfile:
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
with the content
```
node_modules
npm-debug.log
```

Add these scripts to `package.json` file:
```
    "docker:build:dev": "docker build -t starter-app -f ./Docker/dev/Dockerfile .",
    "docker:run": "docker run --rm --publish 49160:8080 --name starter-app -v `pwd`:/var/www/html/starter-app -e ENVIRONMENT_NAME='dev' starter-app"

```

You can run `npm run docker:build:dev` to build the image. Then to run the image run the script `npm run docker:run`.

Now we can call the app using `curl -i localhost:49160`.
