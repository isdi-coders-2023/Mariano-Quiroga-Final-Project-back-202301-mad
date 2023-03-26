import mongoose from 'mongoose';

import { User } from '../../entities/user';

const { Schema, model } = mongoose;

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String },
  role: { type: String },
  notes: { type: Array },
  images: { type: Array },
  token: { type: String },
});

userSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject.password;
  },
});

export const UserModel = model('User', userSchema, 'users');
