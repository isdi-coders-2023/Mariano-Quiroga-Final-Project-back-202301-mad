import { User } from '../entities/user.js';
import { Repo } from '../repository/repo.interface.js';
import { Request, Response, NextFunction } from 'express';
import createDebug from 'debug';
import { Auth, PayloadToken } from '../jwt/auth.js';
const debug = createDebug('SERVER: user.controller');

export class UserController {
  constructor(public repoUser: Repo<User>) {
    this.repoUser = repoUser;
  }

  async register(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('register:post method');

      if (
        !req.body.email ||
        !req.body.password ||
        !req.body.name ||
        !req.body.surname
      )
        throw new Error('Unauthorized');

      req.body.password = await Auth.createHash(req.body.password);

      req.body.saves = [];

      const data = await this.repoUser.create(req.body);

      resp.status(201);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, resp: Response, next: NextFunction) {
    try {
      if (!req.body.email || !req.body.password)
        throw new Error('All input is required');

      let userType: string;

      const data = await this.repoUser.search({
        key: 'email',
        value: req.body.email,
      });

      if (!data.length) throw new Error('Unauthorized');

      if (!(await Auth.compare(req.body.password, data[0].password)))
        throw new Error('Unauthorized');

      if (data[0].email === 'mariano@gmail.com') {
        userType = 'admin';
      }

      userType = 'user';

      const payload: PayloadToken = {
        id: data[0].id,
        email: data[0].email,
        role: userType,
      };

      const token = Auth.createJWT(payload);

      resp.status(202);
      resp.json({
        results: [{ token }],
      });
    } catch (error) {
      next(error);
    }
  }
}
