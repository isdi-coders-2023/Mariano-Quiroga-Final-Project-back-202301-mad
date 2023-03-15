import { Repo } from '../repository/repo.interface.js';
import { Activity } from '../entities/activity.js';
import { Request, Response, NextFunction } from 'express';

export class ActivityController {
  constructor(public activityRepo: Repo<Activity>) {
    this.activityRepo = activityRepo;
  }

  async createActivity(req: Request, resp: Response, next: NextFunction) {
    try {
      req.body.favorites = [];
      const data = this.activityRepo.create(req.body);
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
      const data = this.activityRepo.update(req.body);
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
      this.activityRepo.delete(req.body);
      resp.status(200);
      resp.json({
        result: 'Activity deleted',
      });
    } catch (error) {
      next(error);
    }
  }
}
