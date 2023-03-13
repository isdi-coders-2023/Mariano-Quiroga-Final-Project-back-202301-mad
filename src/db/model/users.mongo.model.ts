import mongoose from 'mongoose';
import { User } from '../../entities/user';

const { Schema, model } = mongoose;

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  password: { type: String, required: true, min: 5, max: 12 },
  email: { type: String, required: true, unique: true },
  age: { type: Number },
  address: { type: String },
  saves: [{ type: Schema.Types.ObjectId, ref: 'Activities' }],
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
