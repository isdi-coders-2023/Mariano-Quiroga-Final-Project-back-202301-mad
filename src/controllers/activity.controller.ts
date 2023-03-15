import { Repo } from '../repository/repo.interface.js';
import { Activity } from '../entities/activity.js';
import { Request, Response, NextFunction } from 'express';

export class ActivityController {
  constructor(public activityRepo: Repo<Activity>) {
    this.activityRepo = activityRepo;
  }

  async createActivity(req: Request, resp: Response, next: NextFunction) {
    try {
      if (!req.body)
        throw new Error('No data received, please insert an activity');

      const data = await this.activityRepo.create(req.body);
      resp.status(200);
      resp.json({
        result: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async editActivity(req: Request, resp: Response, next: NextFunction) {
    try {
      const data = await this.activityRepo.update(req.body);
      if (!data) throw new Error('No data found');
      resp.status(200);
      resp.json({
        result: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteActivity(req: Request, resp: Response, next: NextFunction) {
    try {
      if (!req.params.id) throw new Error('Id not found');
      await this.activityRepo.delete(req.params.id);
      resp.status(200);
      resp.json({
        result: 'Activity deleted',
      });
    } catch (error) {
      next(error);
    }
  }

  async getActivity(_req: Request, resp: Response, next: NextFunction) {
    try {
      const data = await this.activityRepo.query();
      if (!data) throw new Error('No data found');
      resp.status(200);
      resp.json({
        result: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async getActivityByCategory(
    req: Request,
    resp: Response,
    next: NextFunction
  ) {
    try {
      const data = await this.activityRepo.queryId(req.params.id);
      if (!data) throw new Error('No data found');
      resp.status(200);
      resp.json({
        result: [data],
      });
    } catch (error) {
      next(error);
    }
  }
}
