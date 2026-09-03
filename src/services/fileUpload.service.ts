import multer from "multer";
import { HttpError } from "routing-controllers";

import { storage } from "../utilities/aws-s3/config";

export default class FileUploadService {
  static __getMulterInstance(allowedMimeTypes: string[], fileSizeLimit: number) {
    return multer({
      storage,
      fileFilter: (req, file, callback) => {
        if (!allowedMimeTypes.includes(file.mimetype)) return callback(new HttpError(400, "Invalid file format"));

        // no errors
        callback(null, true);
      },
      limits: {
        fileSize: fileSizeLimit,
      },
    });
  }

  static fileUpload() {
    return this.__getMulterInstance(["image/jpg", "image/jpeg", "image/webp", "image/png", "application/pdf"], 1024 * 1024 * 1).single("file");
  }
}
