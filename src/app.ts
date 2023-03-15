import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import createDebug from 'debug';
import cors from 'cors';
const debug = createDebug('SERVER:App');

export const app = express();

const corsOptions = {
  origin: '*',
};

app.disable('x-powered-by');
app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));

app.use((error: Error, _req: Request, resp: Response) => {
  const status = 500;
  const statusMessage = 'Internal server error';

  resp.status(status);
  resp.json({
    error: [
      {
        status,
        statusMessage,
      },
    ],
  });
  debug(status, statusMessage, error.message);
});

app.use('*', (_req, resp, next) => {
  resp
    .status(404)
    .send(
      `<h1>Sorry, the path is not valid. Did you mean "http://localhost:5050/users/"?<h1>`
    );
  next();
});
