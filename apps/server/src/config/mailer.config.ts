import { type MailerOptions } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

export const mailerConfig: MailerOptions = {
  defaults: {
    from: `"nest-modules" <${process.env.MAILER_USER}>`,
  },
  template: {
    adapter: new HandlebarsAdapter(),
    dir: process.cwd() + "/src/templates/email/",
    options: {
      strict: true,
    },
  },
  transport: {
    auth: {
      pass: process.env.MAILER_PASS,
      user: process.env.MAILER_USER,
    },
    host: process.env.MAILER_HOST,
    port: +process.env.MAILER_PORT || 465,
    secure: true,
  },
  verifyTransporters: true,
};
