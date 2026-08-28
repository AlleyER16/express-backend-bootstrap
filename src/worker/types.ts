import { tDoSendEmail } from "../interfaces/email.interface";

export type tSayHello = {
  name: "SAY_HELLO";
  data: {
    name: string;
  };
};

export type tSendEmail = {
  name: "SEND_EMAIL";
  data: tDoSendEmail;
};

export type tWorkerJob = tSayHello | tSendEmail;
