# Development

In this project we will be using many technologies. This document is meant to provide a starting point for the development of a new application. The application will be built using: 
- nodejs
- typescript
- reactjs
- webpack

## Setting up a project

In the terminal, create a new directory and go to it.

```text
mkdir ihme-app && cd ihme-app
```

Initialize `git` and `npm` to create a repository and a `package.json` file.

```text
git init
npm init
```

We don't want to publish unnecessary files, so create a `.gitignore` file and ignore the following files (and any others that make sense to ignore):

```text
.DS_Store
.idea
dist
bundle.js
node_modules
npm-debug.log
```

To get started with typescript we will have to install it.

```text
npm install --save typescript
```

We add a configuration file for typescript to tell typescript what options we want, what files to compile, and where to put the output. Create `tsconfig.json` in the root directory.

```text
touch tsconfig.json
```

`tsconfig`:
```json
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true,
    "alwaysStrict": true,
    "jsx": "react",
    "module": "commonjs",
    "moduleResolution": "node",
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "outDir": "./dist/",
    "sourceMap": true,
    "strictNullChecks": true,
    "target": "es6"
  },
  "files": [
    "./node_modules/@types/node/index.d.ts"
  ],
  "include": [
    "server/**/*.ts",
  ],
  "exclude": [
    "node_modules"
  ]
}
```

For development we are going to create a nodejs server using the `express` framework. Let's install `express` and its typings for `typescript`.

```text
npm install --save express @types/express
```



Resources:
- [git --fast-version-control](https://git-scm.com/docs/git-init)
- [npm](https://docs.npmjs.com/cli/init)
- [typescript tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
- [Express](https://expressjs.com/)