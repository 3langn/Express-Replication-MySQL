import express from 'express';
import httpStatus from 'http-status';
import swaggerUi from 'swagger-ui-express';

import { errorHandler } from './middleware/error';
import ApiError from './utils/ApiError';
import { RegisterRoutes } from '../swagger/routes';
import config from './config/config';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
RegisterRoutes(app);
app.enable('trust proxy');

app.get('/v1', (req: express.Request, res: express.Response) => {
  res.send('Hello World '+config.port);
});

app.post('/v1', (req: express.Request, res: express.Response) => {
  res.send('Hello World '+config.port);
});

app.use('/v1/docs', swaggerUi.serve, async (req: express.Request, res: express.Response) => {
  return res.send(swaggerUi.generateHTML(await import('../swagger/swagger.json')));
});

app.use((req: express.Request, res: express.Response, next:express.NextFunction) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});
app.use(errorHandler);

export default app;
