# Development

In this project we will be using many technologies. 
This document is meant to provide a starting point for the development of a new application. 
The application will be built using: 
- typescript
- nodejs
- reactjs
- webpack

## Setting up the project

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

We will also be structuring our project into `server` and `public` directories.

```text
mkdir server
mkdir public
mkdir public/app
```

Resources:
- [git --fast-version-control](https://git-scm.com/docs/git-init)
- [npm](https://docs.npmjs.com/cli/init)

## Typescript

To get started with typescript we will have to install it.
We will also install TSLint to watch for errors and style.
Since we are going to work with `react` we will need a package for that as well.

```text
npm install --save typescript tslint tslint-react
```

Now we must configure things.

### TSLint

`tslint.json` will configure tslint and set some style rules.

```text
touch tslint.json
```

`tslint.json`:
```json
{
  "defaultSeverity": "error",
  "extends": [
    "tslint:recommended",
    "tslint-react"
  ],
  "jsRules": {},
  "rules": {
    "member-access": [true, "no-public"],
    "trailing-comma": [
      true,
      {
        "multiline": {
          "arrays": "always",
          "functions": "never",
          "objects": "always"
        }
      }
    ],
    "quotemark": [true, "single", "jsx-double"],
    "no-console": false,
    "no-unused-variable": [true, {"ignore-pattern": "^_"}]
  },
  "rulesDirectory": []
}
```

We can add linting scripts to our `package.json`:

```text
"tslint:server": "node_modules/.bin/tslint -p ./server/tsconfig.json",
"tslint:public": "node_modules/.bin/tslint -p ./public/app/tsconfig.json"
```

Resources:
- [TSLint Usage](https://palantir.github.io/tslint/usage/cli/)

### tsconfig.json

A `tsconfig.json` file tells typescript how to compile typescript files.
We can declare what compiler options we want, where to put the compiled code, and which files to include.
We can also create extensions of base configurations. 
This will be helpful when we try to compile our server code and client code into different directories.
Let's create our base configuration.

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
    "sourceMap": true,
    "strictNullChecks": true,
    "target": "es6"
  },
  "exclude": [
    "node_modules"
  ]
}
```

A full list of typescript compiler options is available below. 
Some options can be removed to relax typescript a bit.

Next we will create `tsconfig.json` files for the `server` and `public/app` directories that extend the root config.

```text
touch server/tsconfig.json
touch public/app/tsconfig.json
```

`server/tsconfig.json`:
```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "outDir": "../dist/server"
  },
  "files": [
    "index.ts"
  ]
}
```

`public/app/tsconfig.json`:
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "../../dist/public/app"
  },
  "files": [
    "app.tsx"
  ]
}
```

Resources:
- [typescript tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
- [compiler options](https://www.typescriptlang.org/docs/handbook/compiler-options.html)

## Webpack

Setting up webpack will be one of the more challenging parts of this project. 
Webpack is a useful and beautiful piece of software.
But beware:

> It is incredibly configurable, but to get started you only need to understand four Core Concepts:
>
> - Entry
> - Output
> - Loaders
> - Plugins

Because webpack is so configurable, and because there are so many utilities available, 
it is easy to get lost or end up with a shitty build process.
We will make use of a number of plugins and loaders.
What webpack will do for us:
- Bundle our client side code into [chunks](https://webpack.js.org/plugins/commons-chunk-plugin/), 
separating vendor and common code chunks.
This is an optimization for loading and building times by taking advantage of caching.
- Process our css with [PostCSS](http://postcss.org/) using a webpack [loader](https://github.com/postcss/postcss-loader)
- Create HTML files with out bundled code using a [plugin](https://webpack.js.org/plugins/html-webpack-plugin/)
- Output our typescript files compiled to javascript files to a choosen directory

Let's install what we need:

```text
npm install --save autoprefixer clean-webpack-plugin css-loader html-webpack-plugin postcss-cssnext postcss-loader source-map-loader style-loader typings-for-css-modules-loader webpack webpack-manifest-plugin webpack-notifier
```

Well that's a lot of packages to install. Welcome to JavaScript.

Next we will create the configuration file for webpack.

```text
touch webpack.config.dev.js
```

`webpack.config.dev.js`:
```javascript
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const webpack = require('webpack');
const WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    './public/app/app.tsx',
  ],
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist/app'),
  },
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      {
        test: /\.([jt])sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: "public/app/tsconfig.json",
            }
          }
        ],
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'typings-for-css-modules-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]',
              namedExport: true,
              camelCase: true,
            },
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    }),
    new WebpackNotifierPlugin({ alwaysNotify: true }),
    new CleanWebpackPlugin(['dist/app']),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks(module) {
        return module.context && module.context.indexOf('node_modules') !== -1;
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime'
    }),
    new ManifestPlugin({
      fileName: 'manifest.json',
    }),
    new webpack.HashedModuleIdsPlugin(),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: 'public/index.html',
    })
  ],
  watchOptions: {
    aggregateTimeout: 300,
    ignored: /node_modules/,
    poll: 1000
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    mainFields: ['module', 'jsnext:main', 'main'],
  },
};
```

Resources:
- [Webpack Configuration](https://webpack.js.org/configuration/)
- [TypeScript help via Webpack](https://webpack.js.org/guides/typescript/)
- [Webpack help via TypeScript](https://www.typescriptlang.org/docs/handbook/integrating-with-build-tools.html#webpack)
- [React & Webpack help via TypeScript](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html)

## React

Since we will want to try out this configuration to see it work, let's add `react` to our growing list of dependencies.

```text
npm install react react-dom @types/react @types/react-dom
```

With `react` installed we'll put together a small set files to build our app.

```text
touch public/index.html
touch public/app/app.tsx
mkdir public/app/containers
mkdir public/app/containers/app
touch public/app/containers/app/index.tsx
touch public/app/containers/app/style.css
```

`public/index.html`:
```html
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <title>IHME App</title>
    </head>
    <body>
        <main id="page">
            <p>fall back.</p>
        </main>
    </body>
</html>
```

`public/app/app.tsx`:
```typescript jsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './containers/app/index';

ReactDOM.render(
  <App title={'IHME App'} />,
  document.getElementById('page')
);
```

`public/app/containers/app/index.tsx`:
```typescript jsx
import * as React from 'react';

import * as styles from './style.css';

interface IProps {
  title: string;
}

interface IState {
  name: string;
}

export default class App extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      name: 'world',
    };
  }

  render() {
    return (
      <div className={styles.container}>
        <h1>{this.props.title}</h1>
        <p> Hello {this.state.name}</p>
      </div>
    );
  }
}
```

`public/app/containers/app/style.css`:
```typescript jsx
.container {
    font-family: Helvetica, sans-serif;
}
```

Now if we add `"build:dev": "NODE_ENV=development node_modules/.bin/webpack --colors --config webpack.config.dev.js --watch"`
to our npm scripts we can run:

```text
npm run build:dev
```

There should be a `dist` folder in the root with a subdirectory app containing our html and some js bundles. 
The `--watch` flag starts a process that watches for changes in the public code and rebuilds using caching when changes are made.

## Express Nodejs server

For development we are going to create a nodejs server using the `express` framework.
Let's install `express` and some typings.
We'll also use `nodemon` to watch or changes to our code as we develop the server.

```text
npm install --save nodemon express @types/express @types/node
```

Now we will set up a simple web server that serves up some static files and has a route for an api.

```text
touch server/index.ts server/app.ts
```

`server/index.ts`:
```typescript
import app from './app';

const port = process.env.PORT || 8080;

app.listen(port, (err: any) => {
  if (err) {
    return console.log(err)
  }

  return console.log(`server is listening on ${port}`)
});
```

`server/app.ts`:
```typescript
import * as express from 'express';
import { Application } from 'express-serve-static-core';
import * as path from 'path';

class App {
  express: Application;

  constructor() {
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes(): void {
    const router = express.Router();

    router.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../app/index.html'));
    });

    router.get('/api', (req, res) => {
      res.json({
        message: 'Hello World!',
      });
    });

    this.express.use('/', express.static(path.join(__dirname, '../app')));
    this.express.use('/api', router);
  }
}

export default new App().express;
```

We will use the typescript compiler to compile our code and start a watch process.
Also a nodemon process will rebuild the server after the code compiles.
Adding the following to our npm scripts:
```text
    "tsc:server:dev": "tsc --watch --project server/tsconfig.json",
    "server:dev": "nodemon ./dist/server/index.js"
```

```text
npm run tsc:server:dev
npm run server:dev
npm run build:dev
```

Now we can run the following processes to see it all in action.
Now visit 
```text
http://localhost:8080/
```

Resources:
- [Express](https://expressjs.com/)

## Testing

For writing unit tests of our code, we'll use `mocha` and the `chai` assertion library.
There are a variety of other packages to help us with testing.

```text
npm install --save chai mocha enzyme enzyme-adapter-react-16 sinon ts-node ignore-styles jsdom @types/chai @types/mocha @types/enzyme @types/enzyme-adapter-react-16 @types/sinon @types/jsdom
```

Create a testing directory.

``` text
mkdir public/app/test 
touch public/app/test/app.test.tsx
```

Add the following script to `package.json` to test files in the `public/app` directory:

```text
"test:public": "$(npm bin)/_mocha --project public/app/tsconfig.json --compilers ts:ts-node/register,tsx:ts-node/register --require ignore-styles --full-trace `find ./public -name \"test\" -type d`"
```
A possible test looks like:

```typescript jsx
import { expect } from 'chai';
import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import { JSDOM } from 'jsdom';
import * as React from 'react';

const globalAny: any = global;

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

globalAny.window = window;
globalAny.document = window.document;

Enzyme.configure({ adapter: new Adapter() });

import App from '../containers/app';

describe('<App />', () => {
  it('allows us to set props', () => {
    const wrapper = Enzyme.mount(<App title={'TEST'} />);

    expect(wrapper.props().title).to.equal('TEST');
  });
});
```

Resources:
- [mocha](https://mochajs.org/)
- [chai](http://chaijs.com/)
- [enzyme](http://airbnb.io/enzyme/)