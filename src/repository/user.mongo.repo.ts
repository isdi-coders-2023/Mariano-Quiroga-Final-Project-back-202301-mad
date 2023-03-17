import { Repo } from './repo.interface';
import { UserModel } from '../db/model/users.mongo.model.js';
import { User } from '../entities/user';
import createDebug from 'debug';

const debug = createDebug('SERVER=repo:user');

export class UserRepo implements Repo<User> {
  constructor() {
    debug('instance of UserRepo');
  }

  async query(): Promise<User[]> {
    const users = await UserModel.find();
    if (!users) throw new Error('No users found');
    return users;
  }

  async queryId(id: string): Promise<User> {
    const user = await UserModel.findById(id);
    if (!user) throw new Error('No user found');
    return user;
  }

  async search(query: { key: string; value: unknown }): Promise<User[]> {
    const users = await UserModel.find({ [query.key]: query.value });
    if (!users) throw new Error('No users found');
    return users;
  }

  async create(newItem: Partial<User>): Promise<User> {
    const item = await UserModel.create(newItem);
    if (!item) throw new Error('No user created');
    return item;
  }

  async update(user: Partial<User>): Promise<User> {
    const userToUpdate = await UserModel.findByIdAndUpdate(user.id, user, {
      new: true,
    });
    if (!userToUpdate) throw new Error('No user found');
    return userToUpdate;
  }

  async delete(id: string): Promise<void> {
    const userToDelete = await UserModel.findByIdAndDelete(id);
    if (!userToDelete) throw new Error('Id not found');
  }
}
