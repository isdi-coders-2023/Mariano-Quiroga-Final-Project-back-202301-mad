import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const activitiesSchema = new Schema({
  id: String,
  categories: String,
  name: String,
  activityDetail: String,
  image: String,
  favorites: String,
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
