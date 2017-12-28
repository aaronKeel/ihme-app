import * as express from 'express';
import * as path from 'path';
import {Application} from "express-serve-static-core";

class App {
  public express: Application;

  constructor () {
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes (): void {
    const router = express.Router();

    router.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '/app/index.html'));
    });

    router.get('/api', (req, res) => {
      res.json({
        message: 'Hello World!',
      });
    });

    this.express.use('/', express.static(path.join(__dirname, '/app')));
    this.express.use('/api', router);
  }
}

export default new App().express;
