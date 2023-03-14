import { ActivityRepo } from './activity.mongo.repo.js';
import { ActivitiesModel } from '../db/model/activities.mongo.model.js';

jest.mock('../db/model/activities.mongo.model');

describe('Given the ActivityRepo ', () => {
  const repo = new ActivityRepo();
  describe('When it is instanced ', () => {
    test('Then it should be an instance of ActivityRepo', () => {
      expect(repo).toBeInstanceOf(ActivityRepo);
    });
  });
  describe('When query method is called and there is no info in DB ', () => {
    test('Then it should throw an error', async () => {
      (ActivitiesModel.find as jest.Mock).mockResolvedValue(null);
      await expect(repo.query()).rejects.toThrowError('No activity found');
    });
  });
  describe('When query method is called', () => {
    test('Then it should return a response', async () => {
      (ActivitiesModel.find as jest.Mock).mockResolvedValue([]);
      const resp = await repo.query();
      expect(resp).toEqual([]);
    });
  });
  describe('When queryId method is called and id was nos passed', () => {
    test('Then it should throw an error', async () => {
      (ActivitiesModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(repo.queryId('6')).rejects.toThrowError('No activity found');
    });
  });
  describe('When queryId method is called', () => {
    test('Then it should return a response', async () => {
      (ActivitiesModel.findById as jest.Mock).mockResolvedValue([]);
      const resp = await repo.queryId('6');
      expect(resp).toEqual([]);
    });
  });
  describe('When SEARCH method is called and NO query was sent', () => {
    test('Then it should throw an error', async () => {
      (ActivitiesModel.find as jest.Mock).mockResolvedValue(null);
      const mockQuery = { key: '', value: '' };
      await expect(repo.search(mockQuery)).rejects.toThrowError(
        'No activity found'
      );
    });
  });

  describe('When SEARCH method is called and query was sent', () => {
    test('Then it should return a response', async () => {
      (ActivitiesModel.find as jest.Mock).mockResolvedValue({});
      const mockQuery = { key: 'test', value: 'test' };
      const resp = await repo.search(mockQuery);

      expect(resp).toEqual({});
    });
  });
  describe('When CREATE method is called and no activity is passed', () => {
    test('Then it should throw an error', async () => {
      (ActivitiesModel.create as jest.Mock).mockResolvedValue(null);
      const mockActivity = { activityName: 'test' };
      await expect(repo.create(mockActivity)).rejects.toThrowError(
        'No activity created'
      );
    });
  });
  describe('When CREATE method is called and activity is passed', () => {
    test('Then it should return a response', async () => {
      (ActivitiesModel.create as jest.Mock).mockResolvedValue({
        activityName: 'test',
      });
      const mockActivity = { activityName: 'test' };
      expect(await repo.create(mockActivity)).toEqual({ activityName: 'test' });
    });
  });

  describe('When UPDATE method is called and NO activity is passed', () => {
    test('Then it should throw an error', async () => {
      (ActivitiesModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      await expect(repo.update({})).rejects.toThrow();
    });
  });
  describe('When UPDATE method is called and activity is passed', () => {
    test('Then it should return a response', async () => {
      (ActivitiesModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        activityName: 'test',
        test: 'test',
      });

      const mockActivity = { activityName: 'test', test: 'test' };
      const resp = await repo.update(mockActivity);
      expect(resp).toEqual({
        activityName: 'test',
        test: 'test',
      });
    });
  });

  describe('When DELETE method is called and NO activity is passed', () => {
    test('Then it should return a response', async () => {
      (ActivitiesModel.findOneAndDelete as jest.Mock).mockResolvedValue(null);

      await expect(repo.delete({})).rejects.toThrowError('No activity found');
    });
  });
});
