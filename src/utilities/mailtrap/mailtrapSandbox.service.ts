import { Service } from "typedi";
import nodemailer from "nodemailer";

import { iEmailPayload, iEmailServiceProvider } from "../../interfaces/emailProvider.interface";

import env from "../../env";

@Service()
export default class MailTrapSandboxService implements iEmailServiceProvider {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.mailtrapSandbox.host,
      port: env.mailtrapSandbox.port,
      auth: {
        user: env.mailtrapSandbox.user,
        pass: env.mailtrapSandbox.password,
      },
    });
  }

  async sendEmail({ from, replyTo, to, subject, body }: iEmailPayload) {
    await this.transporter.sendMail({
      from: from,
      replyTo: replyTo || from,
      to: to,
      subject: subject,
      html: body,
    });
  }
}
