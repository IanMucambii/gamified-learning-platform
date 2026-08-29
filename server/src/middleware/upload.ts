import { Request } from "express";
import multer, { FileFilterCallback} from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

function fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDF is allowed"));
}

export default multer({ storage, fileFilter });