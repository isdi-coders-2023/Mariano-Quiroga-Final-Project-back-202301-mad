import { Repo } from './repo.interface';
import { UserModel } from '../db/model/users.mongo.model';
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

  async queryId(_id: string): Promise<User> {
    const user = await UserModel.findById(_id);
    if (!user) throw new Error('No user found');
    return user;
  }

  async search(query: { key: string; value: unknown }): Promise<User[]> {
    const users = await UserModel.find({ [query.key]: [query.value] });
    if (!users) throw new Error('No users found');
    return users;
  }

  async create(newUser: Partial<User>): Promise<User> {
    const user = await UserModel.create(newUser);
    if (!user) throw new Error('No user created');
    return user;
  }

  async update(user: Partial<User>): Promise<User> {
    const userToUpdate = await UserModel.findByIdAndUpdate(user.id, user, {
      new: true,
    });
    if (!userToUpdate) throw new Error('No user found');
    return userToUpdate;
  }

  async delete(user: Partial<User>): Promise<void> {
    const userToDelete = await UserModel.findOneAndDelete(user);
    if (!userToDelete) throw new Error('No user found');
  }
}
