import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: { String, required: true },
  surname: { String, required: true },
  password: { String, required: true, min: 5, max: 12 },
  email: { String, required: true, unique: true },
  age: Number,
  dirección: String,
  guardados: [{ type: Schema.Types.ObjectId, ref: 'Activities' }],
});

export const UserModel = model('User', userSchema, 'users');
