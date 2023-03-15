import { NextFunction, Request, Response } from 'express';
import { Auth, PayloadToken } from '../jwt/auth.js';
import createDebugger from 'debug';

const debug = createDebugger('W7B:Interceptors');

export interface CustomRequest extends Request {
  dataPlus?: PayloadToken;
}

export class Interceptors {
  static logged(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      debug('Logging');

      const authHeader = req.get('Authorization');
      if (!authHeader) throw new Error('Token invalid');

      if (!authHeader.startsWith('Bearer')) throw new Error('Token invalid');

      const token = authHeader.slice(7);
      const tokenPayload = Auth.verifyJWT(token);
      req.dataPlus = tokenPayload;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async authorized(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.dataPlus) throw new Error('Token not found');

      if (!req.body.id) req.body.id = req.params.id;

      if (req.dataPlus.id !== req.body.id) throw new Error('Unauthorized');

      debug('Authorized!');
      next();
    } catch (error) {
      next(error);
    }
  }
}
