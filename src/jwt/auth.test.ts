import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { Auth, PayloadToken } from './auth.js';
import bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

jest.mock('../config', () => ({
  __dirname: 'testdir',
  config: {
    secret: 'a',
  },
}));

jest.mock('jsonwebtoken');

describe('Given the Auth class', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('When a secret is provided', () => {
    test('Then it should call the jwt.sign method', () => {
      Auth.createJWT({ a: test } as unknown as PayloadToken);
      expect(jwt.sign).toHaveBeenCalled();
    });
  });

  describe('When a secret is provided', () => {
    test('Then it should return the token info', async () => {
      config.jwtSecret = 'a';
      Auth.verifyJWT('a');
      expect(jwt.verify).toHaveBeenCalled();
    });
  });
  describe('When typeof result is string', () => {
    test('Then it should throw an error', async () => {
      (jwt.verify as jest.Mock).mockReturnValue('test');

      expect(() => Auth.verifyJWT('a')).toThrow();
    });
  });

  describe('When called the hash with correct data', () => {
    test('Then it should call the bcrypt.hash', () => {
      Auth.createHash('a');
      expect(bcrypt.hash).toHaveBeenCalled();
    });
  });

  describe('When called the compare with correct data', () => {
    test('Then it should call the bcrypt.compare', () => {
      Auth.compare('a', 'b');
      expect(bcrypt.compare).toHaveBeenCalled();
    });
  });
});
