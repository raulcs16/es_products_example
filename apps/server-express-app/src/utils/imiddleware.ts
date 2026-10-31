import { Request, Response, NextFunction } from "express";

export default interface IMiddleWare {
  handle(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class PassBy implements IMiddleWare {
  constructor() {}
  public async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    console.log("passing by");
    next();
  }
}
