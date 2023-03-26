/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Images, User, UserNotes } from '../entities/user.js';
import { Repo } from '../repository/repo.interface.js';
import { Request, Response, NextFunction } from 'express';
import createDebug from 'debug';
import { Auth, PayloadToken } from '../jwt/auth.js';
import { RequestPlus } from '../interceptors/interceptors.js';

const debug = createDebug('SERVER: user.controller');

export class UserController {
  constructor(public repoUser: Repo<User>) {
    this.repoUser = repoUser;
  }

  async register(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('registering in controller');

      if (!req.body.email || !req.body.password || !req.body.name)
        throw new Error('Unauthorized');

      req.body.password = await Auth.createHash(req.body.password);

      req.body.saves = [];
      req.body.notes = [];
      req.body.role = req.body.email === 'mariano@gmail.com' ? 'admin' : 'user';
      const data = await this.repoUser.create(req.body);
      resp.status(201);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      debug('login');
      if (!req.body.email || !req.body.password)
        throw new Error('All input is required');
      const data = await this.repoUser.search({
        key: 'email',
        value: req.body.email,
      });

      if (!data.length) throw new Error('Unauthorized');

      if (!(await Auth.compare(req.body.password, data[0].password)))
        throw new Error('Passwords dont match');

      const payload: PayloadToken = {
        id: data[0].id,
        email: data[0].email,
        role: data[0].role,
      };

      const token = Auth.createJWT(payload);

      const loggedUser = data[0];

      loggedUser.token = token;

      resp.status(202);
      resp.json({
        results: [loggedUser],
      });
    } catch (error) {
      next(error);
    }
  }

  async getUser(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      debug('getUser');

      if (!req.dataPlus) throw new Error('Token not found');
      if (!req.params.userId) throw new Error('Not found');

      if (req.dataPlus.id !== req.params.userId)
        throw new Error('Unauthorized');

      const { userId } = req.params;

      const data = await this.repoUser.queryId(userId);
      resp.status(202);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async createNote(req: RequestPlus, res: Response, next: NextFunction) {
    try {
      debug('creating note');
      const userID = req.dataPlus?.id;
      if (!userID) throw new Error('User id not found');

      const actualUser = await this.repoUser.queryId(userID);

      const note = req.body as UserNotes;

      if (!note) throw new Error('Please insert a note');

      actualUser.notes?.push(note);

      await this.repoUser.update(actualUser);

      res.status(200);
      res.json({
        results: [actualUser],
      });
    } catch (error) {
      next(error);
    }
  }

  async getNotes(req: RequestPlus, res: Response, next: NextFunction) {
    try {
      debug('getNotes');
      const userID = req.dataPlus?.id;
      if (!userID) throw new Error('User id not found');

      const actualUser = await this.repoUser.queryId(userID);
      if (!actualUser.notes) throw new Error('No notes in the profile');
      if (actualUser.notes?.length < 1) throw new Error('You have no notes');
      res.status(200);
      res.json({
        results: [actualUser.notes],
      });
    } catch (error) {
      next(error);
    }
  }

  async editNotes(req: RequestPlus, res: Response, next: NextFunction) {
    try {
      debug('edit Notes');
      const userID = req.dataPlus?.id;
      if (!userID) throw new Error('User id not found');

      const actualUser = await this.repoUser.queryId(userID);
      if (!actualUser.notes) throw new Error('No notes in the profile to edit');
      if (actualUser.notes?.length < 1) throw new Error('You have no notes');

      const newNote = req.body as UserNotes;
      const index = actualUser.notes?.findIndex(
        (note) => note.title === newNote.title
      );
      if (index === -1) throw new Error('Note not found');

      actualUser.notes[index] = newNote;

      await this.repoUser.update(actualUser);
      res.status(200);
      res.json({
        results: [actualUser.notes],
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteNote(req: RequestPlus, res: Response, next: NextFunction) {
    try {
      debug('Delete note');

      const userId = req.dataPlus?.id;
      if (!userId) throw new Error('Id not found');
      const actualUser = await this.repoUser.queryId(userId);
      if (!actualUser) throw new Error('error');

      const noteToDelete = req.body as UserNotes;

      if (!noteToDelete) throw new Error('Please insert a note');

      const index = actualUser.notes?.findIndex(
        (note) => note.title === noteToDelete.title
      );

      if (index === -1) throw new Error('error');

      actualUser.notes?.splice(index!, 1);

      this.repoUser.update(actualUser);

      res.status(200);
      res.json({
        results: [actualUser],
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadImage(req: RequestPlus, res: Response, next: NextFunction) {
    try {
      debug('uploadImage');

      const userId = req.dataPlus?.id;
      if (!userId) throw new Error('Id not found');

      const actualUser = await this.repoUser.queryId(userId);
      if (!actualUser) throw new Error('User not found');

      const userImages = req.body as Images;
      if (!userImages) throw new Error('Image not found');
      actualUser.images?.push(userImages);

      this.repoUser.update(actualUser);

      res.status(200);
      res.json({
        results: [actualUser],
      });
    } catch (error) {
      next(error);
    }
  }
}
