import fs from "fs/promises";
import path from "path";
import Container, { Service } from "typedi";

import { appSettings } from "../loaders/redis.loader";

import WorkerService from "./worker.service";
import MailTrapLiveService from "../utilities/mailtrap/mailtrapLive.service";
import MailTrapSandboxService from "../utilities/mailtrap/mailtrapSandbox.service";

import { iEmailServiceProvider } from "../interfaces/emailProvider.interface";
import type { tDoSendEmail, tEmailFileConfig, tSendEmail } from "../interfaces/email.interface";

import { eAppSettings, eSocialLinksSettings } from "../constants/app.constant";

import env from "../env";

@Service()
export default class EmailService {
  constructor(
    private emailProvider: iEmailServiceProvider = env.nodeEnv === "production" || env.isEmailTest
      ? Container.get(MailTrapLiveService)
      : Container.get(MailTrapSandboxService),
    private testEmailProvider: iEmailServiceProvider = Container.get(MailTrapSandboxService),

    private workerService: WorkerService,
  ) {}

  // [Private]
  private getEmailPriority(name: tSendEmail["name"]) {
    switch (name) {
      case "signUpEmailVerification":
        return 1;
      default:
        return undefined;
    }
  }

  private async getEmailPayload(email: string, data: tSendEmail): Promise<tDoSendEmail> {
    const emailData = await appSettings.get([
      eAppSettings.NOREPLY_EMAIL,
      eAppSettings.SUPPORT_EMAIL,
      eAppSettings.SUPPORT_TELEPHONE,
      eSocialLinksSettings.FACEBOOK,
      eSocialLinksSettings.INSTAGRAM,
      eSocialLinksSettings.LINKEDIN,
      eSocialLinksSettings.X,
    ]);

    let subject: string;
    let content: tDoSendEmail["content"];

    switch (data.name) {
      case "signUpEmailVerification": {
        subject = "Verify Your Email Account";
        content = {
          file: "signup-email-verification",
          metadata: {
            "{APP_NAME}": env.app.name,

            "{OTP}": data.data.otp,
            "{EXPIRES_IN}": `${Math.floor(data.data.expiresIn / 60)} minutes`,
          },
        };

        break;
      }
      case "userOnboarded": {
        subject = `Welcome to ${env.app.name}, You're All Set!`;
        content = {
          file: "user-onboarded",
          metadata: {
            "{APP_NAME}": env.app.name,
          },
        };

        break;
      }
    }

    return {
      email: email,
      subject,
      from: `"${env.app.name}" <${emailData[eAppSettings.NOREPLY_EMAIL]}>`,
      replyTo: `"${env.app.name} Support" <${emailData[eAppSettings.SUPPORT_EMAIL]}>`,
      template: {
        file: "root",
        metadata: {
          "{SUBJECT}": subject,

          "{LOGO}": env.app.emailSending.logo,

          "{SOCIAL_LOGO_X}": env.app.emailSending.socialIcons.x,
          "{SOCIAL_LINK_X}": emailData[eSocialLinksSettings.X],

          "{SOCIAL_LOGO_LINKEDIN}": env.app.emailSending.socialIcons.linkedin,
          "{SOCIAL_LINK_LINKEDIN}": emailData[eSocialLinksSettings.LINKEDIN],

          "{SOCIAL_LOGO_FACEBOOK}": env.app.emailSending.socialIcons.facebook,
          "{SOCIAL_LINK_FACEBOOK}": emailData[eSocialLinksSettings.FACEBOOK],

          "{SOCIAL_LOGO_INSTAGRAM}": env.app.emailSending.socialIcons.instagram,
          "{SOCIAL_LINK_INSTAGRAM}": emailData[eSocialLinksSettings.INSTAGRAM],

          "{SUPPORT_EMAIL}": emailData[eAppSettings.SUPPORT_EMAIL],
          "{SUPPORT_TELEPHONE}": emailData[eAppSettings.SUPPORT_TELEPHONE],
        },
      },
      content,
    };
  }

  private async getAndBuildEmailContent(type: "template" | "content", args?: tEmailFileConfig | string) {
    if (!args) return null;

    if (typeof args === "string") return args;

    let emailContent = await fs.readFile(path.join(__dirname, `../assets/email/${type}s/${args.file}.html`), "utf-8");

    Object.entries(args.metadata).forEach(([key, value]) => {
      emailContent = emailContent.replaceAll(key, value);
    });

    return emailContent;
  }

  // [Public]
  // => Bit expensive hence should be done with Jobs
  async doSendEmail(payload: tDoSendEmail) {
    const [template, content] = await Promise.all([
      this.getAndBuildEmailContent("template", payload.template),
      this.getAndBuildEmailContent("content", payload.content) as Promise<string>,
    ]);

    const emailContent = template ? template.replace("{CONTENT}", content) : content;

    await this[payload.isTest ? "testEmailProvider" : "emailProvider"].sendEmail({
      from: payload.from,
      replyTo: payload.replyTo,
      to: payload.email,
      subject: payload.subject,
      body: emailContent,
    });
  }

  async sendEmail(email: string, data: tSendEmail, useJobs = true) {
    const payload = await this.getEmailPayload(email, data);

    if (!useJobs) return await this.doSendEmail(payload);

    await this.workerService.sendJob(
      { name: "SEND_EMAIL", data: payload },
      {
        priority: this.getEmailPriority(data.name),
      },
    );
  }
}
