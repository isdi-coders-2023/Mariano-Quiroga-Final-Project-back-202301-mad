import { query } from 'express';
import { UserModel } from '../db/model/users.mongo.model.js';
import { User } from '../entities/user.js';
import { UserRepo } from './user.mongo.repo.js';

jest.mock('../db/model/users.mongo.model');

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
  describe('When query method is called and DB has no info', () => {
    test('Then it should throw an error', async () => {
      (UserModel.find as jest.Mock).mockResolvedValue(null);

      await expect(repo.query()).rejects.toThrowError('No users found');
    });
  });
});
