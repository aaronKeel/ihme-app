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
