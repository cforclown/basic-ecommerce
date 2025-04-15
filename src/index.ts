import { Express } from 'express';
import { container, setupDIContainer } from './di-config';
import { Environment } from './utils';

export default class Server {
  private readonly app: Express;

  constructor() {
    this.app = container.resolve('app');
  }
  async start(): Promise<void> {
    try {
      console.log('====================================================');
      console.log(`| ${Environment.getNodeEnv().toUpperCase()} MODE`);

      const port = Environment.getAppPort();
      await this.app.listen(port);

      console.log(`| SERVER STARTED [${port}]`);
      console.log('====================================================');
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  }
}


setupDIContainer();
(new Server()).start().catch(err => console.error(err.message));
