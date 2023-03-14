import JWT from 'jsonwebtoken';
import { config } from '../config.js';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { User } from '../entities/user.js';
import { UserRepo } from '../repository/user.mongo.repo.js';

const repo = new UserRepo();

export async function RegisterJwt(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, surname, email, password } = req.body;

    if (!(email && password && name && surname)) {
      res.status(400).send('All input are required');
    }

    const oldUser = await repo.search({ key: 'email', value: email });

    if (oldUser) {
      return res.status(409).send('User Already Exist. Please Login');
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    let user = await repo.create({
      name,
      surname,
      email,
      password: encryptedPassword,
    });

    const token = JWT.sign(
      { userId: user.id, email },
      config.jwtSecret as string
    );

    user = {
      id: user.id,
      token,
    } as User;
  } catch (error) {
    next(error);
  }
}

export async function LoginJwt(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send('All input is required');
    }

    const user = await repo.search({ key: 'email', value: email });
    if (user && (await bcrypt.compare(password, user[0].password))) {
      const token = JWT.sign(
        { userId: user[0].id, email },
        config.jwtSecret as string
      );

      user[0].token = token;

      res.status(200).json(user);
    }
  } catch (error) {
    next(error);
  }
}
