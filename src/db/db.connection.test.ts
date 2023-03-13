import { dbConnection } from './db.connection';
import mongoose from 'mongoose';

afterEach(async () => {
  mongoose.disconnect();
});
describe('Given a dbConnection function', () => {
  describe('When it is invoked', () => {
    test('Then mongoose should connect with uri', async () => {
      const result = await dbConnection();
      expect(result).toBe(mongoose);
      expect(mongoose.connection.db.databaseName).toContain('_Testing');
    });
  });
  describe('When it is invoked with env variables', () => {
    test('Then mongoose should connect with uri', async () => {
      const result = await dbConnection('env');
      expect(result).toBe(mongoose);
    });
  });
});
