import { Repo } from './repo.interface.js';
import { Activity } from '../entities/activity.js';
import createDebug from 'debug';
import { ActivitiesModel } from '../db/model/activities.mongo.model.js';
const debug = createDebug('SERVER: Activity.Repo');

export class ActivityRepo implements Repo<Activity> {
  constructor() {
    debug('instanciado');
  }

  async create(newActivity: Partial<Activity>): Promise<Activity> {
    const activity = await ActivitiesModel.create(newActivity);
    if (!activity) throw new Error('No activity created');
    return activity;
  }

  async query(): Promise<Activity[]> {
    const activity = await ActivitiesModel.find();
    if (!activity) throw new Error('No activity found');
    return activity;
  }

  async queryId(id: string): Promise<Activity> {
    const activity = await ActivitiesModel.findById(id);
    if (!activity) throw new Error('No activity found');
    return activity;
  }

  async search(query: { key: string; value: unknown }): Promise<Activity[]> {
    const activity = await ActivitiesModel.find({ [query.key]: [query.value] });
    if (!activity) throw new Error('No activity found');
    return activity;
  }

  async update(activity: Partial<Activity>): Promise<Activity> {
    const activityToUpdate = await ActivitiesModel.findByIdAndUpdate(
      activity.id,
      activity,
      {
        new: true,
      }
    );
    if (!activityToUpdate) throw new Error('No activity found');
    return activityToUpdate;
  }

  async delete(id: string): Promise<void> {
    const activityToDelete = await ActivitiesModel.findByIdAndDelete(id);
    if (!activityToDelete) throw new Error('No activity found');
  }
}
