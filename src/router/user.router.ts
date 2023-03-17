import { Router as router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { UserRepo } from '../repository/user.mongo.repo.js';
import { Interceptors } from '../interceptors/interceptors.js';
import createDebug from 'debug';

export const userRouter = router();
const repo = new UserRepo();
const controller = new UserController(repo);
const debug = createDebug('SERVER:user.router');

debug('Router');

userRouter.post('/register', controller.register.bind(controller));
userRouter.post('/login', controller.login.bind(controller));
userRouter.post(
  '/create/note',
  Interceptors.logged,
  controller.createNote.bind(controller)
);
userRouter.delete(
  '/delete/note',
  Interceptors.logged,
  controller.deleteNote.bind(controller)
);
