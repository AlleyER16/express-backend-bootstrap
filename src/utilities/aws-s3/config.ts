import path from "path";

import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

import env from "../../env";

// Client
export const client = new S3Client({
  credentials: {
    accessKeyId: env.aws.accessKeyId,
    secretAccessKey: env.aws.secretAccessKey,
  },
  region: env.aws.defaultRegion,
  forcePathStyle: true,
});

// Storage
export const storage = multerS3({
  s3: client,
  bucket: env.aws.bucket,
  acl: "public-read", // storage access type
  metadata: (_, file, cb) => {
    cb(null, {
      fieldname: file.fieldname,
    });
  },
  key: (_, file, cb) => {
    // Create Unique File Name and Populate Upload Array
    const ext = path.extname(file.originalname.toLowerCase());

    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

    cb(null, `temp/${filename}`);
  },
});
