import { Service } from "typedi";
import { JobsOptions } from "bullmq";

import { tWorkerJob } from "../worker/types";

import workerQueue from "../queue";

// Kinda seems useless that all it does is call the queue but hey better than doing workerQueue.add everywhere around the code
@Service()
export default class WorkerService {
  async sendJob(payload: tWorkerJob, opts?: JobsOptions) {
    await workerQueue.add("doJob", payload, opts);
  }

  async removeJob(id: string) {
    await workerQueue.remove(id);
  }
}
