import { MailerService } from "@nestjs-modules/mailer";
import { Controller, Get } from "@nestjs/common";

import { NetgsmService } from "@/common/netgsm";

import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(
    private appService: AppService,
    private mailerService: MailerService,
    private netgsm: NetgsmService
  ) {}

  @Get()
  index() {
    return this.appService.index();
  }

  @Get("send-mail")
  async sendMail() {
    const mail = this.mailerService.sendMail({
      context: {
        username: "john doe",
      },
      subject: "Testing Nest Mailermodule with template ✔",
      template: "index",
      to: "aydinhalil980@gmail.com",
    });

    return mail;
  }

  @Get("send-sms")
  async sendSMS() {
    return this.netgsm.sendSMS("905422259833", {
      context: {
        username: "john doe",
      },
      template: "index",
    });
  }
}
