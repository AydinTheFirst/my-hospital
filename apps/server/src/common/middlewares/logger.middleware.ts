import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Handler } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use: Handler = (req, _res, next) => {
    Logger.log(`${req.method} - ${req.baseUrl}`, "RequestLogger");
    next();
  };
}
