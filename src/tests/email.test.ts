import "reflect-metadata";

import Container from "typedi";

import EmailService from "../services/email.service";

import env from "../env";

(async function () {
  let [email] = process.argv.slice(2);

  if (!email) email = "email-test@coycube.com";

  const emailService = Container.get(EmailService);

  await emailService.doSendEmail({
    email: email,
    subject: "Verify Your Email Account",
    from: `"Coycube" <no-reply@coycube.com>`,
    replyTo: `"Coycube Support" <support@coycube.com>`,
    template: {
      file: "root",
      metadata: {
        "{SUBJECT}": "Verify Your Email Account",

        "{LOGO}": env.app.emailSending.logo,

        "{SOCIAL_LOGO_X}": env.app.emailSending.socialIcons.x,
        "{SOCIAL_LINK_X}": "https://x.com",

        "{SOCIAL_LOGO_LINKEDIN}": env.app.emailSending.socialIcons.linkedin,
        "{SOCIAL_LINK_LINKEDIN}": "https://linkedin.com",

        "{SOCIAL_LOGO_FACEBOOK}": env.app.emailSending.socialIcons.facebook,
        "{SOCIAL_LINK_FACEBOOK}": "https://facebook.com",

        "{SOCIAL_LOGO_INSTAGRAM}": env.app.emailSending.socialIcons.instagram,
        "{SOCIAL_LINK_INSTAGRAM}": "https://instagram.com",

        "{SUPPORT_EMAIL}": "support@coycube.com",
        "{SUPPORT_TELEPHONE}": "+(234) 812 261 2345",
      },
    },
    content: {
      file: "signup-email-verification",
      metadata: {
        "{OTP}": "123456",
        "{EXPIRES_IN}": "5 minutes",
      },
    },
  });
})();
