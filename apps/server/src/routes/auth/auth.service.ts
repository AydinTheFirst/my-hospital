import { validateTcKimlikNo } from "@demirjs/tckimlikno";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import argon from "argon2";

import { PrismaService } from "@/prisma";

import { LoginDto, RegisterDto } from "./auth.dto";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(body: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: body.username },
          { email: body.username },
          { phoneNumber: body.username },
          { nationalId: body.username },
        ],
      },
    });

    if (!user) throw new NotFoundException("Kullanıcı bulunamadı");

    const isValid = await argon.verify(user.password, body.password);
    if (!isValid)
      throw new BadRequestException("Geçersiz şifre veya kullanıcı");

    const token = await this.prisma.token.create({
      data: {
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week
        userId: user.id,
      },
    });

    return {
      ...user,
      token: token.token,
    };
  }

  async register(body: RegisterDto) {
    const isExist = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: body.email },
          { phoneNumber: body.phoneNumber },
          { nationalId: body.nationalId },
        ],
      },
    });

    if (isExist) {
      throw new BadRequestException(
        "Bu kullanıcı adı veya email zaten kullanılıyor"
      );
    }

    if (
      !(await validateTcKimlikNo({
        birthYear: new Date(body.birthDate).getFullYear(),
        name: body.firstName,
        surname: body.lastName,
        tc: +body.nationalId,
      }))
    ) {
      throw new BadRequestException("Vatandaşlık bilgileriniz doğrulanamadı");
    }

    const hashedPassword = await argon.hash(body.password);

    delete body.password;

    const user = this.prisma.user.create({
      data: {
        ...body,
        birthDate: new Date(body.birthDate),
        password: hashedPassword,
      },
    });

    return user;
  }
}
