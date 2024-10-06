import { Injectable, NestMiddleware } from "@nestjs/common";
import { Handler } from "express";

import { PrismaService } from "@/prisma";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use: Handler = async (req, _res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) return next();

    const tokenDoc = await this.prisma.token.findFirst({
      where: { token },
    });

    if (!tokenDoc) return next();
    if (tokenDoc.expiresAt.getTime() < Date.now()) return next();

    const user = await this.prisma.user.findFirst({
      where: {
        id: tokenDoc.userId,
      },
    });

    if (!user) return next();

    req.user = user;

    next();
  };

  constructor(private prisma: PrismaService) {}
}
