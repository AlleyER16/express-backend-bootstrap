import { Service } from "typedi";
import { CopyObjectCommand, DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

import { client } from "./config";

import env from "../../env";

@Service()
export default class AWSS3Service {
  async writeFile(filePath: string, content: string | Buffer, mimeType: string) {
    await client.send(
      new PutObjectCommand({
        Bucket: env.aws.bucket,
        Key: filePath,
        Body: content,
        ContentType: mimeType,
      }),
    );
  }

  async copyFile(filePath: string, newFilePath: string) {
    await client.send(
      new CopyObjectCommand({
        Bucket: env.aws.bucket,
        CopySource: `${env.aws.bucket}/${filePath}`,
        Key: `${newFilePath}`,
      }),
    );
  }

  async deleteFile(filePath: string) {
    await client.send(
      new DeleteObjectCommand({
        Bucket: env.aws.bucket,
        Key: filePath,
      }),
    );
  }

  async moveFile(filePath: string, newFilePath: string) {
    await this.copyFile(filePath, newFilePath);
    await this.deleteFile(filePath);
  }
}
