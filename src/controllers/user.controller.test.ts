import { UserController } from './user.controller.js';
import { Repo } from '../repository/repo.interface.js';
import { User } from '../entities/user.js';
import { Request, Response, NextFunction } from 'express';
import { Auth } from '../jwt/auth.js';
import { RequestPlus } from '../interceptors/interceptors.js';

jest.mock('../jwt/auth.js');

jest.mock('../config.js', () => ({
  _dirname: 'test',
  config: {
    secret: 'test',
  },
}));

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

  describe('When login method is called and no email or password was passed', () => {
    test('Then it should throw an error and call next', async () => {
      const req = { body: {} } as Request;
      await userController.login(req, resp, next);
      expect(next).toHaveBeenCalled();
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
        body: { notes: undefined },
      } as unknown as Request;

      await userController.createNote(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When deleteNote method is called and note to be deleted is sent', () => {
    test.only('Then it should respond with 200 status and an updated user', async () => {
      const req = {
        dataPlus: { id: '5' },
        body: { notes: 'test' },
      } as unknown as Request;
      (mockRepo.queryId as jest.Mock).mockResolvedValue({ test: 'test' });
      await userController.deleteNote(req, resp, next);
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
  });

  describe('When deleteNote method is called and userId is NOT passed', () => {
    test.only('Then it should throw an error and call next', async () => {
      const req = {
        dataPlus: { id: undefined },
      } as unknown as RequestPlus;

      await userController.deleteNote(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When deleteNote method is called and user is not found', () => {
    test.only('Then it should throw an error and call next', async () => {
      const req = {
        dataPlus: { id: '5' },
        body: { notes: undefined },
      } as unknown as Request;
      (mockRepo.queryId as jest.Mock).mockResolvedValue(undefined);
      await userController.deleteNote(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When deleteNote method is called and note is not passed', () => {
    test.only('Then it should throw an error and call next', async () => {
      const req = {
        dataPlus: { id: '5' },
        body: { notes: undefined },
      } as unknown as Request;
      (mockRepo.queryId as jest.Mock).mockResolvedValue({ test: 'test' });
      await userController.deleteNote(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When deleteNote method is called and indexof does not find the note', () => {
    test.only('Then it should throw an error and call next', async () => {
      const req = {
        dataPlus: { id: '5' },
        body: { notes: 'test2' },
      } as unknown as Request;

      (mockRepo.queryId as jest.Mock).mockResolvedValue({ notes: ['test'] });
      await userController.deleteNote(req, resp, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
