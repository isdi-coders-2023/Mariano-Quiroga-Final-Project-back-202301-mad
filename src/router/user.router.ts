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
userRouter.get(
  '/:userId',
  Interceptors.logged,
  controller.getUser.bind(controller)
);
userRouter.post(
  '/create/note',
  Interceptors.logged,
  controller.createNote.bind(controller)
);
userRouter.get(
  '/get/note',
  Interceptors.logged,
  controller.getNotes.bind(controller)
);

userRouter.patch(
  '/edit/note',
  Interceptors.logged,
  controller.editNotes.bind(controller)
);

userRouter.delete(
  '/delete/note',
  Interceptors.logged,
  controller.deleteNote.bind(controller)
);

userRouter.post(
  '/upload/image',
  Interceptors.logged,
  controller.uploadImage.bind(controller)
);
