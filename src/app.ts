import express from 'express';
import httpStatus from 'http-status';
import swaggerUi from 'swagger-ui-express';

import { errorHandler } from './middleware/error';
import ApiError from './utils/ApiError';
import { RegisterRoutes } from '../swagger/routes';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
RegisterRoutes(app);
app.enable('trust proxy');
app.get('/v1', (req, res) => {
  res.send('Hello World');
  console.log('Hello World');
});

app.use('/v1/docs', swaggerUi.serve, async (req: express.Request, res: express.Response) => {
  return res.send(swaggerUi.generateHTML(await import('../swagger/swagger.json')));
});

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});
app.use(errorHandler);

export default app;
