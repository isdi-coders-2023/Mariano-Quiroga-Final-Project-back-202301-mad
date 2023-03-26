/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { UserController } from './user.controller.js';
import { Repo } from '../repository/repo.interface.js';
import { User } from '../entities/user.js';
import { Request, Response, NextFunction } from 'express';
import { Auth } from '../jwt/auth.js';
import { RequestPlus } from '../interceptors/interceptors.js';

jest.mock('../jwt/auth.js');

const mockRepo: Repo<User> = {
  create: jest.fn(),
  search: jest.fn(),
  queryId: jest.fn(),
  update: jest.fn(),
} as unknown as Repo<User>;

const userController = new UserController(mockRepo);

const resp = {
  status: jest.fn(),
  json: jest.fn(),
} as unknown as Response;

const next = jest.fn() as NextFunction;

describe('Given the UserController class ', () => {
  describe('When it is instantiated', () => {
    test('Then it should be an instance of userController ', () => {
      expect(userController).toBeInstanceOf(UserController);
    });
  });

  describe('When register method is called with no data', () => {
    test('Then it should throw an error', async () => {
      const req = { body: {} } as Request;
      await userController.register(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When register receive a password through the body', () => {
    test('Then Auth should hash the password', async () => {
      const req = {
        body: {
          email: 'test',
          password: 'test',
          name: 'test',
          surname: 'test',
        },
      } as Request;
      Auth.createJWT = jest.fn().mockReturnValue('test');
      await userController.register(req, resp, next);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
  });
  describe('When register receive an specific email through the body', () => {
    test('Then req.body.role is admin', async () => {
      const req = {
        body: {
          email: 'mariano@gmail.com',
          password: 'test',
          name: 'test',
          surname: 'test',
        },
      } as Request;

      Auth.createHash = jest.fn().mockReturnValue('test');
      await userController.register(req, resp, next);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
  });

  describe('When login method is called and no email or password was passed', () => {
    test('Then it should throw an error and call next', async () => {
      const req = { body: {} } as Request;
      await userController.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When login method is called with admin email', () => {
    test('Then it should apply admin role to user', async () => {
      const req = {
        body: { email: 'mariano@gmail.com', password: '12345' },
      } as Request;
      (mockRepo.search as jest.Mock).mockResolvedValue([
        { email: 'mariano@gmail.com' },
      ]);
      (Auth.compare as jest.Mock).mockResolvedValue(true);
      await userController.login(req, resp, next);
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
  });

  describe('When login method is called and valid email and password were passed', () => {
    test('Then it should reponse with a resp.json and status 200', async () => {
      const req = { body: { email: 'test', password: 'test' } } as Request;
      (mockRepo.search as jest.Mock).mockResolvedValue(['test']);
      Auth.compare = jest.fn().mockResolvedValue(true);
      await userController.login(req, resp, next);
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
  });

  describe('When login method is called and data is empty', () => {
    test('Then it should throw an error and call next', async () => {
      const req = { body: { email: 'test', password: 'test' } } as Request;
      (mockRepo.search as jest.Mock).mockResolvedValue([]);

      await userController.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When login method is called and data is empty', () => {
    test('Then it should throw an error and call next', async () => {
      const req = { body: { email: 'test', password: 'test' } } as Request;
      (mockRepo.search as jest.Mock).mockResolvedValue(['a']);

      (Auth.compare as jest.Mock).mockResolvedValue(false);
      await userController.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When login method is called with an admin email', () => {
    test('Then it should respond with a json', async () => {
      const req = {
        body: { email: 'mariano@gmail.com', password: 'test' },
      } as Request;
      (mockRepo.search as jest.Mock).mockResolvedValue(['mariano@gmail.com']);

      (Auth.compare as jest.Mock).mockResolvedValue(true);
      await userController.login(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });
  });

  describe('When the getUser method is called ', () => {
    test('Then it should return a user', async () => {
      const req = {
        dataPlus: { id: 'test1' },
        params: { userId: 'test1' },
      } as unknown as RequestPlus;
      (mockRepo.queryId as jest.Mock).mockResolvedValue({ name: 'm' });
      await userController.getUser(req, resp, next);
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
  });

  describe('When getUser method is called and req.dataPlus is not found', () => {
    test('Then it should throw an error and  call next', async () => {
      const req = {} as unknown as RequestPlus;
      await userController.getUser(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When getUser method is called and req.params is not found', () => {
    test('Then it should throw an error and  call next', async () => {
      const req = {
        dataPlus: {},
        params: { userId: undefined },
      } as unknown as RequestPlus;
      await userController.getUser(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When getUser method is called and req.params.userId is not equal to req.dataPlus.id', () => {
    test('Then it should throw an error and  call next', async () => {
      const req = {
        dataPlus: { id: '3' },
        params: { userId: '4' },
      } as unknown as RequestPlus;
      await userController.getUser(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When createNote method is called and userId is passed', () => {
    test('Then it should reponde with status 200 and an updated user', async () => {
      const req = {
        dataPlus: { id: '5' },
        body: { notes: 'test' },
      } as unknown as RequestPlus;
      (mockRepo.queryId as jest.Mock).mockResolvedValue({ notes: ['test'] });
      await userController.createNote(req, resp, next);
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
  });

  describe('When createNote method is called and userId is NOT passed', () => {
    test('Then it should throw an error and call next', async () => {
      const req = {
        dataPlus: { id: undefined },
      } as unknown as RequestPlus;

      await userController.createNote(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When createNote method is called and note is NOT passed', () => {
    test('Then it should throw an error and call next', async () => {
      const req = {
        dataPlus: { id: '5' },
        body: undefined,
      } as unknown as RequestPlus;
      (mockRepo.queryId as jest.Mock).mockResolvedValue({
        id: '5',
        name: 'test',
      });
      await userController.createNote(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When getNotes is called', () => {
    test('Then it should return an array of notes', async () => {
      const req = { dataPlus: { id: '4' } } as unknown as RequestPlus;
      (mockRepo.queryId as jest.Mock).mockResolvedValue({
        name: 'm',
        notes: ['nota'],
      });
      await userController.getNotes(req, resp, next);
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
  });

  describe('When getNotes is called but user is not found', () => {
    test('Then it should throw an error and call next', async () => {
      const req = { dataPlus: { id: undefined } } as unknown as RequestPlus;

      await userController.getNotes(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When getNotes is called but there is no notes property', () => {
    test('Then it should throw an error and call next', async () => {
      const req = { dataPlus: { id: '6' } } as unknown as RequestPlus;
      (mockRepo.queryId as jest.Mock).mockResolvedValue({
        name: 'm',
      });
      await userController.getNotes(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When getNotes is called but there is no notes', () => {
    test('Then it should throw an error and call next', async () => {
      const req = { dataPlus: { id: '6' } } as unknown as RequestPlus;
      (mockRepo.queryId as jest.Mock).mockResolvedValue({
        name: 'm',
        notes: [],
      });
      await userController.getNotes(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When getNotes is called but user is not found', () => {
    test('Then it should throw an error and call next', async () => {
      const req = { dataPlus: { id: undefined } } as unknown as RequestPlus;

      await userController.getNotes(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When editNotes method is called and note to be edited is sent', () => {
    test('Then it should respond with 200 status and an updated user', async () => {
      const req = {
        dataPlus: { id: '5' },
        body: { title: 'title', note: 'note2' },
      } as unknown as RequestPlus;
      (mockRepo.queryId as jest.Mock).mockResolvedValue({
        notes: [{ title: 'title', note: 'note' }],
      });

      (mockRepo.update as jest.Mock).mockResolvedValue({
        notes: [{ title: 'title', note: 'note2' }],
      });
      await userController.editNotes(req, resp, next);
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
  });

  describe('When editNotes is called but user is not found', () => {
    test('Then it should throw an error and call next', async () => {
      const req = { dataPlus: { id: undefined } } as unknown as RequestPlus;

      await userController.editNotes(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When editNotes is called but user does not have notes property', () => {
    test('Then it should throw an error and call next', async () => {
      const req = { dataPlus: { id: '7' } } as unknown as RequestPlus;
      (mockRepo.queryId as jest.Mock).mockResolvedValue({ name: 'test' });
      await userController.editNotes(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When editNotes is called but user does not have notes', () => {
    test('Then it should throw an error and call next', async () => {
      const req = { dataPlus: { id: '7' } } as unknown as RequestPlus;
      (mockRepo.queryId as jest.Mock).mockResolvedValue({ notes: [] });
      await userController.editNotes(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When editNotes is called but note to be updated is not found', () => {
    test('Then it should throw an error and call next', async () => {
      const req = {
        dataPlus: { id: '8' },
        body: { title: 'title2', note: 'note2' },
      } as unknown as RequestPlus;
      (mockRepo.queryId as jest.Mock).mockResolvedValue({
        notes: [{ title: 'title3', note: 'note1' }],
      });
      await userController.editNotes(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When deleteNote method is called and note to be deleted is sent', () => {
    test('Then it should respond with 200 status and an updated user', async () => {
      const req = {
        dataPlus: { id: '5' },
        body: { title: 'test', note: 'test2' },
      } as unknown as Request;
      (mockRepo.queryId as jest.Mock).mockResolvedValue({
        notes: [{ title: 'test', note: 'test' }],
      });
      await userController.deleteNote(req, resp, next);
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
  });

  describe('When deleteNote method is called and userId is NOT passed', () => {
    test('Then it should throw an error and call next', async () => {
      const req = {
        dataPlus: { id: undefined },
      } as unknown as RequestPlus;

      await userController.deleteNote(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When deleteNote method is called and note is not found', () => {
    test('Then it should throw an error and call next', async () => {
      const req = {
        dataPlus: { id: '5' },
        body: undefined,
      } as unknown as Request;

      await userController.deleteNote(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When deleteNote method is called and indexof does not find the note', () => {
    test('Then it should throw an error and call next', async () => {
      const req = {
        dataPlus: { id: '5' },
        body: { title: 'delete2', note: 'delete2' },
      } as unknown as Request;

      (mockRepo.queryId as jest.Mock).mockResolvedValue({
        notes: [{ title: 'test', note: 'delete2' }],
      });
      await userController.deleteNote(req, resp, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('When upload Image method is called', () => {
    test('Then it should upload an image into user profile', async () => {
      const req = {
        dataPlus: { id: '3' },
        body: { image: 'test' },
      } as RequestPlus;

      (mockRepo.queryId as jest.Mock).mockResolvedValue({
        id: '3',
        name: 'test',
        images: [{ image: 'imgtes' }],
      });

      await userController.uploadImage(req, resp, next);
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
  });

  describe('When uploadImage is called with no ID', () => {
    test('Then it should throw an error', async () => {
      const req = {} as unknown as RequestPlus;

      await userController.uploadImage(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When uploadImage is called and user is not found', () => {
    test('Then it should throw an error', async () => {
      const req = { dataPlus: { id: '3' } } as unknown as RequestPlus;
      (mockRepo.queryId as jest.Mock).mockResolvedValue(undefined);
      await userController.uploadImage(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When uploadImage is called and image is not found', () => {
    test('Then it should throw an error', async () => {
      const req = {
        dataPlus: { id: '3' },
        body: undefined,
      } as unknown as RequestPlus;
      (mockRepo.queryId as jest.Mock).mockResolvedValue({ name: 'test' });
      await userController.uploadImage(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
