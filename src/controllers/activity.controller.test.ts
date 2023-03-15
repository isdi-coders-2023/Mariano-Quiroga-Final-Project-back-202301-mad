import { Repo } from '../repository/repo.interface.js';
import { Activity } from '../entities/activity.js';
import { Request, Response, NextFunction } from 'express';
import { ActivityController } from './activity.controller.js';

const mockRepo: Repo<Activity> = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  query: jest.fn(),
  queryId: jest.fn(),
} as unknown as Repo<Activity>;

const resp = {
  status: jest.fn(),
  json: jest.fn(),
} as unknown as Response;

const next = jest.fn() as NextFunction;

const controller = new ActivityController(mockRepo);

describe('Given the ActivityController class', () => {
  describe('When it is instanciated', () => {
    test('Then it should an instance of ActivityController', () => {
      expect(controller).toBeInstanceOf(ActivityController);
    });
  });
  describe('When createActivity is called and NO data is passed ', () => {
    test('Then it should throw an error and calle next', async () => {
      const req = {} as unknown as Request;

      await controller.createActivity(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When createActivity is called and data sent as argument', () => {
    test('Then it should respond with json. ', async () => {
      const req = { body: { categories: 'test' } } as unknown as Request;
      mockRepo.create = jest.fn().mockResolvedValue('test');
      await controller.createActivity(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
    });
  });

  describe('When editActivituy is called and NO data is passed ', () => {
    test('Then it should throw an error and calle next', async () => {
      const req = {} as unknown as Request;

      await controller.editActivity(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When editActivituy is called and data sent as argument', () => {
    test('Then it should respond with json. ', async () => {
      const req = { body: { categories: 'test' } } as unknown as Request;
      mockRepo.update = jest.fn().mockResolvedValue('test');
      await controller.editActivity(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
    });
  });
  describe('When deleteActivity is called and id is not found ', () => {
    test('Then it should throw an error and calle next', async () => {
      const req = { params: {} } as unknown as Request;

      await controller.deleteActivity(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When deleteActivity is called and the id is correct', () => {
    test('Then it should delete the activty. ', async () => {
      const req = { params: { id: '5' } } as unknown as Request;

      await controller.deleteActivity(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
    });
  });
  describe('When getActivity is called and data is not found ', () => {
    test('Then it should throw an error and calle next', async () => {
      const req = {} as unknown as Request;

      await controller.getActivity(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When getActivity is called and there is data in DB', () => {
    test('Then it should respond with a status 200 and resp.json', async () => {
      const req = {} as unknown as Request;
      mockRepo.query = jest.fn().mockResolvedValue(['test']);
      await controller.getActivity(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
    });
  });
  describe('When getActivityByCategory is called and data is not found ', () => {
    test('Then it should throw an error and called next', async () => {
      const req = { params: {} } as unknown as Request;

      await controller.getActivityByCategory(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When getActivityByCategory is called and there is data in DB', () => {
    test('Then it should respond with a status 200 and resp.json', async () => {
      const req = { params: { id: '5' } } as unknown as Request;
      mockRepo.queryId = jest.fn().mockResolvedValue('test');
      await controller.getActivityByCategory(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
    });
  });
});
