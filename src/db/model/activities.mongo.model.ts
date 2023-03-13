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

export const ActivitiesModel = model(
  'Activities',
  activitiesSchema,
  'activities'
);
