import path from "path";

import { Service } from "typedi";

import { ServiceResponse } from "./response.service";
import AWSS3Service from "../utilities/aws-s3/awsS3.service";

import env from "../env";

@Service()
export default class AppService {
  constructor(private awsS3Service: AWSS3Service) {}

  async rootPath() {
    return ServiceResponse.success(`Welcome to ${env.app.name} Backend API`, {});
  }

  async testUpload(file: Express.MulterS3.File) {
    await this.awsS3Service.moveFile(file.key, `test-upload/${path.basename(file.key)}`);

    return ServiceResponse.success("File uploaded successfully", {});
  }
}
