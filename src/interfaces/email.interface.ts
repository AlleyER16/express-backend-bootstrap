// [Individual types]
type tSignUpEmailVerificationEmail = {
  name: "signUpEmailVerification";
  data: {
    otp: string;
    expiresIn: number;
  };
};

type tUserOnboardedEmail = {
  name: "userOnboarded";
};

// [Union]
export type tSendEmail = tSignUpEmailVerificationEmail | tUserOnboardedEmail;

// [Worker]
// Each file determines it's metadata. It'll be values coded in {KEY}
// Service will always look for file at assets/email/[templates|contents] directory
export type tEmailFileConfig = {
  file: string;
  metadata: {
    [key: string]: string;
  };
};

export type tDoSendEmail = {
  email: string;
  subject: string;
  from: string;
  replyTo?: string;

  template?: tEmailFileConfig; // Optional, email doesn't have to use a template
  content: tEmailFileConfig | string; // Required can be a file content or entire content hardcoded in content ket

  isTest?: boolean; // If true, will ignore active emailProvider and force test email
};
