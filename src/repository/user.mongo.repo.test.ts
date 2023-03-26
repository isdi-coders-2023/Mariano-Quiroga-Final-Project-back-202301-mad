import { UserModel } from '../db/model/users.mongo.model.js';
import { UserRepo } from './user.mongo.repo.js';

jest.mock('../db/model/users.mongo.model.js');

describe('Given the UserRepo class ', () => {
  const repo = new UserRepo();
  describe('When it is instanced', () => {
    test('Then it should be an instance of UserRepo', () => {
      expect(repo).toBeInstanceOf(UserRepo);
    });
  });
  describe('When query method is called and DB has no info', () => {
    test('Then it should throw an error', async () => {
      (UserModel.find as jest.Mock).mockResolvedValue(null);

      await expect(repo.query()).rejects.toThrowError('No users found');
    });
  });
  describe('When query method is called', () => {
    test('Then it should return a response', async () => {
      (UserModel.find as jest.Mock).mockResolvedValue([]);
      const resp = await repo.query();
      expect(resp).toEqual([]);
    });
  });
  describe('When queryId method is called and id was nos passed', () => {
    test('Then it should throw an error', async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(repo.queryId('6')).rejects.toThrowError('No user found');
    });
  });
  describe('When queryId method is called', () => {
    test('Then it should return a response', async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue([]);
      const resp = await repo.queryId('6');
      expect(resp).toEqual([]);
    });
  });
  describe('When SEARCH method is called and query was sent', () => {
    test('Then it should return a response', async () => {
      (UserModel.find as jest.Mock).mockResolvedValue([{ _doc: '', _id: '4' }]);
      const mockQuery = { key: 'test', value: 'test' };
      const resp = await repo.search(mockQuery);

      expect(resp).toEqual([{ id: '4' }]);
    });

    describe('When SEARCH method is called and NO query was sent', () => {
      test('Then it should throw an error', async () => {
        (UserModel.find as jest.Mock).mockResolvedValue(null);
        const mockQuery = { key: '', value: '' };
        await expect(repo.search(mockQuery)).rejects.toThrowError(
          'No users found'
        );
      });
    });
  });
  describe('When CREATE method is called and no user is passed', () => {
    test('Then it should throw an error', async () => {
      (UserModel.create as jest.Mock).mockResolvedValue(null);
      const mockUser = { name: 'test' };
      await expect(repo.create(mockUser)).rejects.toThrowError(
        'No user created'
      );
    });
  });
  describe('When CREATE method is called and user is passed', () => {
    test('Then it should return a response', async () => {
      (UserModel.create as jest.Mock).mockResolvedValue({ name: 'test' });
      const mockUser = { name: 'test' };
      expect(await repo.create(mockUser)).toEqual({ name: 'test' });
    });
  });
  describe('When UPDATE method is called and NO user is passed', () => {
    test('Then it should throw an error', async () => {
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      await expect(repo.update({})).rejects.toThrow();
    });
  });
  describe('When UPDATE method is called and user is passed', () => {
    test('Then it should return a response', async () => {
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        name: 'test',
      });
      const mockUser = { name: 'test' };
      expect(await repo.update(mockUser)).toEqual({ name: 'test' });
    });
  });
  describe('When DELETE method is called and NO user is passed', () => {
    test('Then it should return a response', async () => {
      (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(undefined);

      await expect(repo.delete).rejects.toThrowError('Id not found');
    });
  });
});
