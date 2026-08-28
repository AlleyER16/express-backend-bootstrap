import { Service } from "typedi";
import nodemailer from "nodemailer";

import { iEmailPayload, iEmailServiceProvider } from "../../interfaces/emailProvider.interface";

import env from "../../env";

@Service()
export default class MailTrapLiveService implements iEmailServiceProvider {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.mailtrap.host,
      port: env.mailtrap.port,
      auth: {
        user: env.mailtrap.user,
        pass: env.mailtrap.password,
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
