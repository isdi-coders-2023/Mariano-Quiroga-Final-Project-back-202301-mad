import mongoose from 'mongoose';
import { Activity } from '../../entities/activity';

const { Schema, model } = mongoose;

const activitiesSchema = new Schema<Activity>({
  id: { type: String },
  categories: { type: String },
  name: { type: String },
  activityDetail: { type: String },
  image: { type: String },
  favorites: { type: String },
});

activitiesSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
  },
});

export const ActivitiesModel = model(
  'Activities',
  activitiesSchema,
  'activities'
);
