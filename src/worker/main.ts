import "reflect-metadata";
import { Worker } from "bullmq";
import Container, { Service } from "typedi";

import { connection } from "./config";

import { tWorkerJob } from "./types";

import EmailService from "../services/email.service";
import LoggerService from "../services/logger.service";

import { QUEUE_KEY } from "../constants/app.constant";

@Service()
class WorkerClass {
  // Inject all classes here
  constructor(private emailService: EmailService) {}

  // This assumes all jobs will be promise type which should be mostly trie
  async doJob(data: tWorkerJob) {
    switch (data.name) {
      case "SAY_HELLO": {
        // Test 1
        console.log("Hello,", data.name);

        // Test 2
        // throw new Error("Just Testing");

        break;
      }
      case "SEND_EMAIL": {
        await this.emailService.doSendEmail(data.data);

        break;
      }
    }
  }
}

// Allows for injecting all class during instantiation not during each job
const workerObject = Container.get(WorkerClass);

// [Background Job Worker]
const worker = new Worker<tWorkerJob, void>(
  QUEUE_KEY,
  async (job) => {
    LoggerService.log("info", "NEW_WORKER_JOB", {
      data: {
        id: job.id,
        name: job.name,
        appData: job.data,
      },
    });

    await workerObject.doJob(job.data);
  },
  { connection },
);

export default worker;

// [Register Events]
// => Job Events
worker.on("failed", (job, err) => {
  LoggerService.log("info", "WORKER_JOB_FAILED", {
    data: {
      id: job?.id,
      name: job?.name,
      appData: job?.data,
    },
    error: err as Error,
  });
});
worker.on("completed", (job) => {
  LoggerService.log("info", "WORKER_JOB_COMPLETED", {
    data: {
      id: job?.id,
      name: job?.name,
      appData: job?.data,
    },
  });
});

// => Worker Events
worker.on("ready", () => {
  LoggerService.log("info", "WORKER_READY");
});
worker.on("error", (err) => {
  LoggerService.log("error", "WORKER_ERROR", {
    error: err as Error,
  });
});
