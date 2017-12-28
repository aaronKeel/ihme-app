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
