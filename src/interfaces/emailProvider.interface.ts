export interface iEmailPayload {
  from: string;
  replyTo?: string;
  to: string;
  subject: string;
  body: string;
}

export interface iEmailServiceProvider {
  sendEmail(payload: iEmailPayload): Promise<void>;
}
