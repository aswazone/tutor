import { UploadController } from "@/controllers/implements/upload.controller";
import { UploadService } from "@/services/implements/upload.service";

export const uploadController = new UploadController(new UploadService());