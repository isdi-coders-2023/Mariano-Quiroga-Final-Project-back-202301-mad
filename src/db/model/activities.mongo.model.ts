import mongoose from 'mongoose';
import { Activity } from '../../entities/activity.js';

const { Schema, model } = mongoose;

const activitiesSchema = new Schema<Activity>({
  categories: { type: String },
  activityName: { type: String },
  subActivity: { type: String },
  activityDetails: { type: String },
  images: { type: Array },
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
