import Logger from './core/Logger';
import { port } from './config';
import app from './app';

app
  .listen(port, () => {
    Logger.info(`server running on port : ${3000}`);
  })
  .on('error', (e) => console.log(e));
